# Подбор слов Wordstat — план реализации, этап 1

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** проекты семантики на домен с группами и фразами, ручной сбор левой/правой колонок Wordstat в фоне, пресеты (личные и командные), счётчик запросов, выгрузка XLSX.

**Architecture:** отдельный модуль: модели `App\Wordstat\*`, чистые сервисы `App\Services\Wordstat\*` (разбор ввода, настройки, ключ фразы, оценка, клиент API), сборщик `WordstatCollector` + джобы в очереди `wordstat`, контроллер `WordstatKeywordsController` с JSON-ответами для AJAX, Blade + `public/js/cabinet-wordstat-keywords.js`.

**Tech Stack:** Laravel 6.20, PHP ≥ 7.4 (prod 8.5), MySQL, spatie/laravel-permission, maatwebsite/excel 3.1, PHPUnit 7.5, jQuery + Select2, `cabinet-ajax-form.js`.

Спецификация: [cabinet-wordstat-keywords-design.md](./cabinet-wordstat-keywords-design.md).

## Global Constraints

- Синтаксис PHP 7.4: без union types, `match`, nullsafe `?->`, constructor promotion, `str_contains`; типизированные свойства и стрелочные функции можно.
- Тесты: `/opt/homebrew/opt/php@7.4/bin/php vendor/bin/phpunit …` (PHPUnit 7.5 не работает на PHP 8.x). Artisan/миграции локально: `/opt/homebrew/opt/php@8.5/bin/php artisan …`.
- Feature-тесты — на локальной БД `cabinet_titlo_local` в `DatabaseTransactions`, ничего не сохраняют.
- UI без имён поставщиков (xmlstock и др.): «Wordstat», «сбор частотности».
- Числа ≥ 1 000 — с пробелом тысяч (`number_format($n, 0, '', ' ')` / JS `toLocaleString('ru-RU')` с заменой NBSP на пробел не требуется — достаточно пробела).
- Подсказки — `pages.partials.site-audit-tip`, без `title="…"`.
- Select2 (theme `bootstrap4`, `width: '100%'`, в модалке `dropdownParent`) для регионов и пресетов.
- Действия без перезагрузки: формы через `data-ajax-form` (`public/js/cabinet-ajax-form.js`) или `fetch` с JSON.
- Таблицы без DataTables; данные клиенту — JSON в `<script type="application/json">`.
- Очередь `wordstat`, supervisor-группа `cabinet-titlo-wordstat`, `numprocs=2`.
- Скорость запросов к API: настройка `wordstat_rps`, по умолчанию 5.
- `left_limit` по умолчанию 200 (1–2 000), фраза ≤ 400 символов и ≤ 7 слов.
- Право и пункт меню: `Wordstat keywords`.
- Коммиты — в `cabinet.titlo.ru` (код) и `titlo.ru` (доки), только свои файлы.

## Карта файлов

| Файл | Ответственность |
|---|---|
| `config/cabinet-wordstat-keywords.php` | версия, endpoint, rps, лимиты |
| `database/migrations/2026_11_24_100000_create_wordstat_keywords_tables.php` | 7 таблиц |
| `database/migrations/2026_11_24_100100_add_wordstat_keywords_menu_and_permission.php` | пункт меню + право |
| `app/Wordstat/WordstatProject.php` … `WordstatRequestLog.php` | Eloquent-модели |
| `app/Services/Wordstat/WordstatSettings.php` | нормализация настроек пресета |
| `app/Services/Wordstat/WordstatPhraseKey.php` | ключ дубля фразы |
| `app/Services/Wordstat/WordstatInputParser.php` | разбор textarea → затравки по группам |
| `app/Services/Wordstat/WordstatEstimator.php` | оценка запросов |
| `app/Services/Wordstat/WordstatPhraseFilter.php` | минус-слова и стоп-слова |
| `app/Services/Wordstat/WordstatResult.php`, `WordstatException.php`, `WordstatClient.php`, `WordstatRateLimiter.php` | API |
| `app/Services/Wordstat/WordstatCollector.php` | сбор одной затравки, жизненный цикл run |
| `app/Jobs/Wordstat/StartWordstatRun.php`, `CollectWordstatSeed.php` | очередь |
| `app/Http/Controllers/WordstatKeywordsController.php` | HTTP |
| `app/Exports/WordstatPhrasesExport.php` | XLSX |
| `resources/views/wordstat-keywords/index.blade.php`, `show.blade.php` | страницы |
| `public/js/cabinet-wordstat-keywords.js`, `public/css/cabinet-wordstat-keywords.css` | клиент |
| `tests/Unit/Wordstat/*Test.php`, `tests/Feature/Wordstat/*Test.php` | тесты |
| `deploy/supervisor/cabinet-titlo.conf.example`, `scripts/deploy-titlo.sh` | воркеры |
| `titlo.ru/docs/cabinet-wordstat-keywords-changelog.md` | журнал версий |

---

### Task 1: Конфиг, таблицы, модели

**Files:**
- Create: `config/cabinet-wordstat-keywords.php`
- Create: `database/migrations/2026_11_24_100000_create_wordstat_keywords_tables.php`
- Create: `app/Wordstat/WordstatProject.php`, `WordstatGroup.php`, `WordstatPhrase.php`, `WordstatRun.php`, `WordstatRunSeed.php`, `WordstatPreset.php`, `WordstatRequestLog.php`
- Create: `titlo.ru/docs/cabinet-wordstat-keywords-changelog.md`
- Test: `tests/Feature/Wordstat/WordstatModelsTest.php`

**Interfaces:**
- Produces: модели с отношениями `WordstatProject::groups()`, `phrases()`, `runs()`; `WordstatGroup::phrases()`; `WordstatRun::seeds()`, `project()`; `WordstatRunSeed::run()`, `group()`; `WordstatProject::isAccessibleBy(int $userId): bool`, `WordstatProject::scopeAccessibleBy($q, int $userId)`, `WordstatProject::teamIdsForMember(int $userId): array`.
- Константы статусов: `WordstatRun::STATUS_QUEUED|RUNNING|DONE|FAILED|CANCELLED`, `WordstatRunSeed::STATUS_QUEUED|DONE|FAILED|SKIPPED`, `WordstatPhrase::STATUS_ACTIVE|MINUS|DELETED`, `WordstatPhrase::SOURCE_LEFT|RIGHT|MANUAL`.

- [ ] **Step 1: Конфиг**

```php
<?php
// config/cabinet-wordstat-keywords.php
return [
    'version' => '1.0.0',
    'endpoint' => env('WORDSTAT_ENDPOINT', 'https://xmlstock.com/wordstat/json/'),
    'http_timeout' => (int) env('WORDSTAT_HTTP_TIMEOUT', 30),
    'rps_default' => 5,
    'queue' => 'wordstat',
    'max_phrase_length' => 400,
    'max_phrase_words' => 7,
    'max_seeds_per_run' => 500,
    'retry_delays' => [10, 30, 90, 90],
];
```

- [ ] **Step 2: Миграция таблиц**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWordstatKeywordsTables extends Migration
{
    public function up(): void
    {
        Schema::create('wordstat_projects', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id')->index();
            $table->unsignedBigInteger('team_id')->nullable()->index();
            $table->string('domain', 255);
            $table->string('title', 255)->nullable();
            $table->json('region_ids')->nullable();
            $table->string('device', 16)->default('all');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('wordstat_groups', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('project_id')->index();
            $table->string('name', 255);
            $table->string('page_url', 2048)->nullable();
            $table->string('source', 16)->default('manual');
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
            $table->unique(['project_id', 'name']);
        });

        Schema::create('wordstat_runs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('project_id')->index();
            $table->unsignedBigInteger('user_id')->index();
            $table->json('settings');
            $table->string('status', 16)->default('queued')->index();
            $table->unsignedInteger('seeds_total')->default(0);
            $table->unsignedInteger('seeds_done')->default(0);
            $table->unsignedInteger('requests_estimated')->default(0);
            $table->unsignedInteger('requests_used')->default(0);
            $table->unsignedInteger('phrases_added')->default(0);
            $table->string('error', 1000)->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('finished_at')->nullable();
            $table->timestamps();
        });

        Schema::create('wordstat_run_seeds', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('run_id')->index();
            $table->unsignedBigInteger('group_id');
            $table->string('phrase', 400);
            $table->unsignedTinyInteger('depth')->default(0);
            $table->string('status', 16)->default('queued');
            $table->unsignedSmallInteger('requests_used')->default(0);
            $table->string('error', 1000)->nullable();
            $table->timestamps();
            $table->index(['run_id', 'status']);
        });

        Schema::create('wordstat_phrases', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('project_id');
            $table->unsignedBigInteger('group_id')->index();
            $table->string('phrase', 400);
            $table->string('phrase_key', 191);
            $table->unsignedBigInteger('freq')->nullable();
            $table->unsignedBigInteger('freq_exact')->nullable();
            $table->string('source', 16);
            $table->unsignedBigInteger('seed_phrase_id')->nullable();
            $table->unsignedTinyInteger('depth')->default(0);
            $table->string('status', 16)->default('active');
            $table->boolean('is_commercial')->nullable();
            $table->unsignedBigInteger('run_id')->nullable();
            $table->timestamps();
            $table->unique(['project_id', 'phrase_key']);
            $table->index(['project_id', 'status']);
        });

        Schema::create('wordstat_presets', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id')->index();
            $table->unsignedBigInteger('team_id')->nullable()->index();
            $table->string('title', 255);
            $table->json('settings');
            $table->timestamps();
        });

        Schema::create('wordstat_request_log', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('project_id')->nullable();
            $table->unsignedBigInteger('run_id')->nullable();
            $table->string('kind', 16)->default('words');
            $table->timestamp('created_at')->useCurrent();
            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wordstat_request_log');
        Schema::dropIfExists('wordstat_presets');
        Schema::dropIfExists('wordstat_phrases');
        Schema::dropIfExists('wordstat_run_seeds');
        Schema::dropIfExists('wordstat_runs');
        Schema::dropIfExists('wordstat_groups');
        Schema::dropIfExists('wordstat_projects');
    }
}
```

- [ ] **Step 3: Модели**

```php
<?php
// app/Wordstat/WordstatProject.php
namespace App\Wordstat;

use App\SeoChecklist\SeoChecklistTeamMember;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WordstatProject extends Model
{
    use SoftDeletes;

    protected $table = 'wordstat_projects';
    protected $fillable = ['user_id', 'team_id', 'domain', 'title', 'region_ids', 'device'];
    protected $casts = ['region_ids' => 'array', 'user_id' => 'int', 'team_id' => 'int'];

    public function groups()
    {
        return $this->hasMany(WordstatGroup::class, 'project_id')->orderBy('position')->orderBy('id');
    }

    public function phrases()
    {
        return $this->hasMany(WordstatPhrase::class, 'project_id');
    }

    public function runs()
    {
        return $this->hasMany(WordstatRun::class, 'project_id')->orderByDesc('id');
    }

    /** @return array<int, int> */
    public static function teamIdsForMember(int $userId): array
    {
        if ($userId < 1) {
            return [];
        }

        return SeoChecklistTeamMember::query()->where('user_id', $userId)
            ->pluck('team_id')->map(fn ($id) => (int) $id)->filter()->unique()->values()->all();
    }

    public function scopeAccessibleBy($query, int $userId)
    {
        $teamIds = self::teamIdsForMember($userId);

        return $query->where(function ($q) use ($userId, $teamIds) {
            $q->where('user_id', $userId);
            if ($teamIds !== []) {
                $q->orWhereIn('team_id', $teamIds);
            }
        });
    }

    public function isAccessibleBy(int $userId): bool
    {
        if ((int) $this->user_id === $userId) {
            return true;
        }

        return $this->team_id && in_array((int) $this->team_id, self::teamIdsForMember($userId), true);
    }
}
```

```php
<?php
// app/Wordstat/WordstatGroup.php
namespace App\Wordstat;

use Illuminate\Database\Eloquent\Model;

class WordstatGroup extends Model
{
    public const DEFAULT_NAME = 'Без группы';

    protected $table = 'wordstat_groups';
    protected $fillable = ['project_id', 'name', 'page_url', 'source', 'position'];

    public function phrases()
    {
        return $this->hasMany(WordstatPhrase::class, 'group_id');
    }
}
```

```php
<?php
// app/Wordstat/WordstatPhrase.php
namespace App\Wordstat;

use Illuminate\Database\Eloquent\Model;

class WordstatPhrase extends Model
{
    public const STATUS_ACTIVE = 'active';
    public const STATUS_MINUS = 'minus';
    public const STATUS_DELETED = 'deleted';

    public const SOURCE_LEFT = 'left';
    public const SOURCE_RIGHT = 'right';
    public const SOURCE_MANUAL = 'manual';

    protected $table = 'wordstat_phrases';
    protected $fillable = [
        'project_id', 'group_id', 'phrase', 'phrase_key', 'freq', 'freq_exact', 'source',
        'seed_phrase_id', 'depth', 'status', 'is_commercial', 'run_id',
    ];
    protected $casts = ['freq' => 'int', 'freq_exact' => 'int', 'depth' => 'int', 'is_commercial' => 'bool'];
}
```

```php
<?php
// app/Wordstat/WordstatRun.php
namespace App\Wordstat;

use Illuminate\Database\Eloquent\Model;

class WordstatRun extends Model
{
    public const STATUS_QUEUED = 'queued';
    public const STATUS_RUNNING = 'running';
    public const STATUS_DONE = 'done';
    public const STATUS_FAILED = 'failed';
    public const STATUS_CANCELLED = 'cancelled';

    protected $table = 'wordstat_runs';
    protected $fillable = [
        'project_id', 'user_id', 'settings', 'status', 'seeds_total', 'seeds_done', 'requests_estimated',
        'requests_used', 'phrases_added', 'error', 'started_at', 'finished_at',
    ];
    protected $casts = ['settings' => 'array', 'started_at' => 'datetime', 'finished_at' => 'datetime'];

    public function project()
    {
        return $this->belongsTo(WordstatProject::class, 'project_id');
    }

    public function seeds()
    {
        return $this->hasMany(WordstatRunSeed::class, 'run_id');
    }

    public function isActive(): bool
    {
        return in_array($this->status, [self::STATUS_QUEUED, self::STATUS_RUNNING], true);
    }
}
```

```php
<?php
// app/Wordstat/WordstatRunSeed.php
namespace App\Wordstat;

use Illuminate\Database\Eloquent\Model;

class WordstatRunSeed extends Model
{
    public const STATUS_QUEUED = 'queued';
    public const STATUS_DONE = 'done';
    public const STATUS_FAILED = 'failed';
    public const STATUS_SKIPPED = 'skipped';

    protected $table = 'wordstat_run_seeds';
    protected $fillable = ['run_id', 'group_id', 'phrase', 'depth', 'status', 'requests_used', 'error'];
    protected $casts = ['depth' => 'int'];

    public function run()
    {
        return $this->belongsTo(WordstatRun::class, 'run_id');
    }

    public function group()
    {
        return $this->belongsTo(WordstatGroup::class, 'group_id');
    }
}
```

```php
<?php
// app/Wordstat/WordstatPreset.php
namespace App\Wordstat;

use Illuminate\Database\Eloquent\Model;

class WordstatPreset extends Model
{
    protected $table = 'wordstat_presets';
    protected $fillable = ['user_id', 'team_id', 'title', 'settings'];
    protected $casts = ['settings' => 'array', 'user_id' => 'int', 'team_id' => 'int'];

    public function scopeVisibleTo($query, int $userId)
    {
        $teamIds = WordstatProject::teamIdsForMember($userId);

        return $query->where(function ($q) use ($userId, $teamIds) {
            $q->where('user_id', $userId);
            if ($teamIds !== []) {
                $q->orWhereIn('team_id', $teamIds);
            }
        });
    }
}
```

```php
<?php
// app/Wordstat/WordstatRequestLog.php
namespace App\Wordstat;

use Illuminate\Database\Eloquent\Model;

class WordstatRequestLog extends Model
{
    public const UPDATED_AT = null;

    protected $table = 'wordstat_request_log';
    protected $fillable = ['user_id', 'project_id', 'run_id', 'kind', 'created_at'];
}
```

- [ ] **Step 4: Тест моделей**

```php
<?php
// tests/Feature/Wordstat/WordstatModelsTest.php
namespace Tests\Feature\Wordstat;

use App\Wordstat\WordstatGroup;
use App\Wordstat\WordstatProject;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class WordstatModelsTest extends TestCase
{
    use DatabaseTransactions;

    public function testProjectAccessibleByOwnerOnly(): void
    {
        $project = WordstatProject::query()->create([
            'user_id' => 999001, 'domain' => 'example.ru', 'region_ids' => [213], 'device' => 'all',
        ]);
        WordstatGroup::query()->create(['project_id' => $project->id, 'name' => 'Окна']);

        $this->assertTrue($project->isAccessibleBy(999001));
        $this->assertFalse($project->isAccessibleBy(999002));
        $this->assertSame(1, WordstatProject::query()->accessibleBy(999001)->where('id', $project->id)->count());
        $this->assertSame(0, WordstatProject::query()->accessibleBy(999002)->where('id', $project->id)->count());
        $this->assertSame([213], $project->fresh()->region_ids);
        $this->assertSame('Окна', $project->groups()->first()->name);
    }
}
```

- [ ] **Step 5: Мигрировать локально и прогнать тест**

Run: `/opt/homebrew/opt/php@8.5/bin/php artisan migrate --path=database/migrations/2026_11_24_100000_create_wordstat_keywords_tables.php`
Expected: `Migrated: 2026_11_24_100000_create_wordstat_keywords_tables`

Run: `/opt/homebrew/opt/php@7.4/bin/php vendor/bin/phpunit tests/Feature/Wordstat/WordstatModelsTest.php`
Expected: `OK (1 test, 6 assertions)`

- [ ] **Step 6: Changelog и коммит**

`titlo.ru/docs/cabinet-wordstat-keywords-changelog.md`:

```markdown
# Подбор слов Wordstat — changelog

## 1.0.0 — в работе
- Таблицы проектов, групп, фраз, запусков, пресетов, журнала запросов.
```

```bash
git add config/cabinet-wordstat-keywords.php database/migrations/2026_11_24_100000_create_wordstat_keywords_tables.php app/Wordstat tests/Feature/Wordstat/WordstatModelsTest.php
git commit -m "feat(wordstat): tables and models for keyword collection module"
```

---

### Task 2: Настройки пресета `WordstatSettings`

**Files:**
- Create: `app/Services/Wordstat/WordstatSettings.php`
- Test: `tests/Unit/Wordstat/WordstatSettingsTest.php`

**Interfaces:**
- Produces: `WordstatSettings::normalize(array $raw): array` — всегда возвращает все ключи: `region_ids` int[], `device` string, `columns` string[], `left_limit` int, `depth` int, `depth_left_limit` int, `depth_max_seeds` int, `minus_words` string[], `stop_words` string[], `exact_freq` bool. `WordstatSettings::defaults(): array`. `WordstatSettings::parseWordList($value): array` (строка с переводами строк/запятыми или массив).

- [ ] **Step 1: Тест**

```php
<?php
namespace Tests\Unit\Wordstat;

use App\Services\Wordstat\WordstatSettings;
use PHPUnit\Framework\TestCase;

class WordstatSettingsTest extends TestCase
{
    public function testDefaultsWhenEmpty(): void
    {
        $s = WordstatSettings::normalize([]);
        $this->assertSame([213], $s['region_ids']);
        $this->assertSame('all', $s['device']);
        $this->assertSame(['left', 'right'], $s['columns']);
        $this->assertSame(200, $s['left_limit']);
        $this->assertSame(0, $s['depth']);
        $this->assertSame(50, $s['depth_left_limit']);
        $this->assertSame(100, $s['depth_max_seeds']);
        $this->assertSame([], $s['minus_words']);
        $this->assertFalse($s['exact_freq']);
    }

    public function testClampsAndCleans(): void
    {
        $s = WordstatSettings::normalize([
            'region_ids' => ['213', 'x', 2, 2],
            'device' => 'fridge',
            'columns' => ['right', 'middle'],
            'left_limit' => '5000',
            'depth' => 9,
            'depth_left_limit' => 0,
            'depth_max_seeds' => -3,
            'minus_words' => "Бесплатно\n своими руками ,бесплатно",
            'stop_words' => ['  Купить '],
            'exact_freq' => '1',
        ]);
        $this->assertSame([213, 2], $s['region_ids']);
        $this->assertSame('all', $s['device']);
        $this->assertSame(['right'], $s['columns']);
        $this->assertSame(2000, $s['left_limit']);
        $this->assertSame(2, $s['depth']);
        $this->assertSame(1, $s['depth_left_limit']);
        $this->assertSame(0, $s['depth_max_seeds']);
        $this->assertSame(['бесплатно', 'своими руками'], $s['minus_words']);
        $this->assertSame(['купить'], $s['stop_words']);
        $this->assertTrue($s['exact_freq']);
    }

    public function testEmptyColumnsFallBackToBoth(): void
    {
        $this->assertSame(['left', 'right'], WordstatSettings::normalize(['columns' => []])['columns']);
    }
}
```

- [ ] **Step 2: Запустить — FAIL**

Run: `/opt/homebrew/opt/php@7.4/bin/php vendor/bin/phpunit tests/Unit/Wordstat/WordstatSettingsTest.php`
Expected: FAIL, `Class 'App\Services\Wordstat\WordstatSettings' not found`

- [ ] **Step 3: Реализация**

```php
<?php
namespace App\Services\Wordstat;

class WordstatSettings
{
    public const DEVICES = ['all', 'desktop', 'phone', 'tablet'];
    public const COLUMNS = ['left', 'right'];

    public static function defaults(): array
    {
        return [
            'region_ids' => [213],
            'device' => 'all',
            'columns' => ['left', 'right'],
            'left_limit' => 200,
            'depth' => 0,
            'depth_left_limit' => 50,
            'depth_max_seeds' => 100,
            'minus_words' => [],
            'stop_words' => [],
            'exact_freq' => false,
        ];
    }

    public static function normalize(array $raw): array
    {
        $d = self::defaults();

        $regions = [];
        foreach ((array) ($raw['region_ids'] ?? $d['region_ids']) as $id) {
            if (is_numeric($id) && (int) $id > 0 && ! in_array((int) $id, $regions, true)) {
                $regions[] = (int) $id;
            }
        }
        $regions = array_slice($regions, 0, 100);

        $device = (string) ($raw['device'] ?? $d['device']);
        $columns = $d['columns'];
        if (isset($raw['columns']) && is_array($raw['columns'])) {
            $columns = array_values(array_unique(array_filter($raw['columns'], fn ($c) => in_array($c, self::COLUMNS, true))));
        }

        return [
            'region_ids' => $regions !== [] ? $regions : $d['region_ids'],
            'device' => in_array($device, self::DEVICES, true) ? $device : 'all',
            'columns' => $columns !== [] ? $columns : $d['columns'],
            'left_limit' => self::clampInt($raw['left_limit'] ?? $d['left_limit'], 1, 2000),
            'depth' => self::clampInt($raw['depth'] ?? $d['depth'], 0, 2),
            'depth_left_limit' => self::clampInt($raw['depth_left_limit'] ?? $d['depth_left_limit'], 1, 200),
            'depth_max_seeds' => self::clampInt($raw['depth_max_seeds'] ?? $d['depth_max_seeds'], 0, 1000),
            'minus_words' => self::parseWordList($raw['minus_words'] ?? []),
            'stop_words' => self::parseWordList($raw['stop_words'] ?? []),
            'exact_freq' => filter_var($raw['exact_freq'] ?? false, FILTER_VALIDATE_BOOLEAN),
        ];
    }

    /** @return array<int, string> */
    public static function parseWordList($value): array
    {
        $items = is_array($value) ? $value : preg_split('/[\r\n,]+/u', (string) $value);
        $out = [];
        foreach ($items as $item) {
            $word = trim(preg_replace('/\s+/u', ' ', mb_strtolower((string) $item)));
            $word = str_replace('ё', 'е', $word);
            if ($word !== '' && ! in_array($word, $out, true)) {
                $out[] = $word;
            }
        }

        return array_slice($out, 0, 500);
    }

    private static function clampInt($value, int $min, int $max): int
    {
        return max($min, min($max, (int) $value));
    }
}
```

- [ ] **Step 4: Запустить — PASS**

Run: `/opt/homebrew/opt/php@7.4/bin/php vendor/bin/phpunit tests/Unit/Wordstat/WordstatSettingsTest.php`
Expected: `OK (3 tests, …)`

- [ ] **Step 5: Коммит**

```bash
git add app/Services/Wordstat/WordstatSettings.php tests/Unit/Wordstat/WordstatSettingsTest.php
git commit -m "feat(wordstat): preset settings normalizer"
```

---

### Task 3: Ключ фразы, фильтр слов, разбор ввода

**Files:**
- Create: `app/Services/Wordstat/WordstatPhraseKey.php`, `WordstatPhraseFilter.php`, `WordstatInputParser.php`
- Test: `tests/Unit/Wordstat/WordstatInputParserTest.php`, `tests/Unit/Wordstat/WordstatPhraseFilterTest.php`

**Interfaces:**
- Produces:
  - `WordstatPhraseKey::make(string $phrase): string` — нижний регистр, `ё→е`, убраны операторы `! + " [ ] ( ) |` и минус перед словом, схлопнуты пробелы, обрезано до 191 символа.
  - `WordstatPhraseFilter::hasMinusWord(string $phrase, array $minusWords): bool` — минус-слово совпадает с целым словом или многословной подстрокой по границам слов.
  - `WordstatPhraseFilter::stripStopWords(string $phrase, array $stopWords): string`.
  - `WordstatInputParser::parse(string $text, string $defaultGroup, int $maxLength = 400, int $maxWords = 7): array` → `['seeds' => [['group' => string, 'phrase' => string], …], 'rejected' => [['line' => string, 'reason' => 'too_long'|'too_many_words'], …]]`; дубли (группа + ключ) отбрасываются молча.

- [ ] **Step 1: Тесты**

```php
<?php
namespace Tests\Unit\Wordstat;

use App\Services\Wordstat\WordstatInputParser;
use App\Services\Wordstat\WordstatPhraseKey;
use PHPUnit\Framework\TestCase;

class WordstatInputParserTest extends TestCase
{
    public function testPlainLinesGoToDefaultGroup(): void
    {
        $r = WordstatInputParser::parse("пластиковые окна\n\n  Натяжные   потолки \n", 'Без группы');
        $this->assertSame([
            ['group' => 'Без группы', 'phrase' => 'пластиковые окна'],
            ['group' => 'Без группы', 'phrase' => 'Натяжные потолки'],
        ], $r['seeds']);
        $this->assertSame([], $r['rejected']);
    }

    public function testColonHeaderAndTabFormats(): void
    {
        $text = "Окна: пластиковые окна\n# Потолки\nнатяжные потолки\nпотолки армстронг\nДвери\tмежкомнатные двери";
        $r = WordstatInputParser::parse($text, 'Без группы');
        $this->assertSame([
            ['group' => 'Окна', 'phrase' => 'пластиковые окна'],
            ['group' => 'Потолки', 'phrase' => 'натяжные потолки'],
            ['group' => 'Потолки', 'phrase' => 'потолки армстронг'],
            ['group' => 'Двери', 'phrase' => 'межкомнатные двери'],
        ], $r['seeds']);
    }

    public function testDuplicatesInSameGroupDropped(): void
    {
        $r = WordstatInputParser::parse("окна пвх\nОкна  ПВХ\nА: окна пвх", 'Б');
        $this->assertCount(2, $r['seeds']);
    }

    public function testRejectsLongAndWordy(): void
    {
        $r = WordstatInputParser::parse(str_repeat('а', 401) . "\nодин два три четыре пять шесть семь восемь", 'Б');
        $this->assertSame([], $r['seeds']);
        $this->assertSame('too_long', $r['rejected'][0]['reason']);
        $this->assertSame('too_many_words', $r['rejected'][1]['reason']);
    }

    public function testPhraseKey(): void
    {
        $this->assertSame('купить елку', WordstatPhraseKey::make('  "!Купить  +ёлку" '));
        $this->assertSame('окна пвх', WordstatPhraseKey::make('окна [пвх] -дешево'));
    }
}
```

```php
<?php
namespace Tests\Unit\Wordstat;

use App\Services\Wordstat\WordstatPhraseFilter;
use PHPUnit\Framework\TestCase;

class WordstatPhraseFilterTest extends TestCase
{
    public function testMinusWordMatchesWholeWordsOnly(): void
    {
        $this->assertTrue(WordstatPhraseFilter::hasMinusWord('окна бесплатно москва', ['бесплатно']));
        $this->assertFalse(WordstatPhraseFilter::hasMinusWord('окна бесплатного монтажа', ['бесплатно']));
        $this->assertTrue(WordstatPhraseFilter::hasMinusWord('потолок своими руками видео', ['своими руками']));
        $this->assertTrue(WordstatPhraseFilter::hasMinusWord('Ёлка Бесплатно', ['бесплатно']));
    }

    public function testStripStopWords(): void
    {
        $this->assertSame('пластиковые окна', WordstatPhraseFilter::stripStopWords('купить пластиковые окна недорого', ['купить', 'недорого']));
        $this->assertSame('окна', WordstatPhraseFilter::stripStopWords('окна', []));
    }
}
```

- [ ] **Step 2: Запустить — FAIL**

Run: `/opt/homebrew/opt/php@7.4/bin/php vendor/bin/phpunit tests/Unit/Wordstat`
Expected: FAIL, классы не найдены.

- [ ] **Step 3: Реализация**

```php
<?php
namespace App\Services\Wordstat;

class WordstatPhraseKey
{
    public static function make(string $phrase): string
    {
        $s = mb_strtolower($phrase);
        $s = str_replace('ё', 'е', $s);
        $s = preg_replace('/(^|\s)-\S+/u', ' ', $s);
        $s = preg_replace('/[!+"\[\]()|]/u', ' ', $s);
        $s = trim(preg_replace('/\s+/u', ' ', $s));

        return mb_substr($s, 0, 191);
    }
}
```

```php
<?php
namespace App\Services\Wordstat;

class WordstatPhraseFilter
{
    public static function hasMinusWord(string $phrase, array $minusWords): bool
    {
        if ($minusWords === []) {
            return false;
        }
        $haystack = ' ' . WordstatPhraseKey::make($phrase) . ' ';
        foreach ($minusWords as $word) {
            $needle = WordstatPhraseKey::make((string) $word);
            if ($needle !== '' && mb_strpos($haystack, ' ' . $needle . ' ') !== false) {
                return true;
            }
        }

        return false;
    }

    public static function stripStopWords(string $phrase, array $stopWords): string
    {
        if ($stopWords === []) {
            return trim(preg_replace('/\s+/u', ' ', $phrase));
        }
        $stop = array_map([WordstatPhraseKey::class, 'make'], $stopWords);
        $words = preg_split('/\s+/u', trim($phrase));
        $kept = array_filter($words, fn ($w) => ! in_array(WordstatPhraseKey::make($w), $stop, true));

        return implode(' ', $kept);
    }
}
```

```php
<?php
namespace App\Services\Wordstat;

class WordstatInputParser
{
    public static function parse(string $text, string $defaultGroup, int $maxLength = 400, int $maxWords = 7): array
    {
        $seeds = [];
        $rejected = [];
        $seen = [];
        $current = $defaultGroup;

        foreach (preg_split('/\r\n|\r|\n/u', $text) as $rawLine) {
            $line = trim($rawLine);
            if ($line === '') {
                continue;
            }

            if (mb_substr($line, 0, 1) === '#') {
                $name = trim(mb_substr($line, 1));
                $current = $name !== '' ? self::cleanGroup($name) : $defaultGroup;
                continue;
            }

            $group = $current;
            $phrase = $line;

            if (mb_strpos($rawLine, "\t") !== false) {
                [$g, $p] = array_map('trim', explode("\t", $rawLine, 2));
                if ($g !== '' && $p !== '') {
                    $group = self::cleanGroup($g);
                    $phrase = $p;
                }
            } elseif (preg_match('/^([^:]{1,120}):\s*(.+)$/u', $line, $m)) {
                $group = self::cleanGroup($m[1]);
                $phrase = trim($m[2]);
            }

            $phrase = trim(preg_replace('/\s+/u', ' ', $phrase));
            if (mb_strlen($phrase) > $maxLength) {
                $rejected[] = ['line' => mb_substr($line, 0, 120), 'reason' => 'too_long'];
                continue;
            }
            if (count(preg_split('/\s+/u', WordstatPhraseKey::make($phrase))) > $maxWords) {
                $rejected[] = ['line' => mb_substr($line, 0, 120), 'reason' => 'too_many_words'];
                continue;
            }

            $dedupe = mb_strtolower($group) . '|' . WordstatPhraseKey::make($phrase);
            if ($phrase === '' || isset($seen[$dedupe])) {
                continue;
            }
            $seen[$dedupe] = true;
            $seeds[] = ['group' => $group, 'phrase' => $phrase];
        }

        return ['seeds' => $seeds, 'rejected' => $rejected];
    }

    private static function cleanGroup(string $name): string
    {
        return mb_substr(trim(preg_replace('/\s+/u', ' ', $name)), 0, 255);
    }
}
```

- [ ] **Step 4: Запустить — PASS**

Run: `/opt/homebrew/opt/php@7.4/bin/php vendor/bin/phpunit tests/Unit/Wordstat`
Expected: `OK` (все тесты Task 2 и Task 3).

- [ ] **Step 5: Коммит**

```bash
git add app/Services/Wordstat/WordstatPhraseKey.php app/Services/Wordstat/WordstatPhraseFilter.php app/Services/Wordstat/WordstatInputParser.php tests/Unit/Wordstat
git commit -m "feat(wordstat): input parser, phrase key and minus/stop word filter"
```

---

### Task 4: Оценка запросов `WordstatEstimator`

**Files:**
- Create: `app/Services/Wordstat/WordstatEstimator.php`
- Test: `tests/Unit/Wordstat/WordstatEstimatorTest.php`

**Interfaces:**
- Consumes: нормализованный массив из `WordstatSettings::normalize()`.
- Produces: `WordstatEstimator::estimate(int $seedCount, array $settings): array` → `['seeds' => int, 'depth' => int, 'total' => int]`; правило: одна затравка = один запрос (левая и правая колонки в одном ответе), досбор по глубине — верхняя граница `depth_max_seeds` при `depth ≥ 1`, иначе 0.

- [ ] **Step 1: Тест**

```php
<?php
namespace Tests\Unit\Wordstat;

use App\Services\Wordstat\WordstatEstimator;
use App\Services\Wordstat\WordstatSettings;
use PHPUnit\Framework\TestCase;

class WordstatEstimatorTest extends TestCase
{
    public function testNoDepth(): void
    {
        $e = WordstatEstimator::estimate(12, WordstatSettings::normalize([]));
        $this->assertSame(['seeds' => 12, 'depth' => 0, 'total' => 12], $e);
    }

    public function testDepthAddsCap(): void
    {
        $e = WordstatEstimator::estimate(3, WordstatSettings::normalize(['depth' => 1, 'depth_max_seeds' => 40]));
        $this->assertSame(['seeds' => 3, 'depth' => 40, 'total' => 43], $e);
    }
}
```

- [ ] **Step 2: FAIL**

Run: `/opt/homebrew/opt/php@7.4/bin/php vendor/bin/phpunit tests/Unit/Wordstat/WordstatEstimatorTest.php`
Expected: FAIL, класс не найден.

- [ ] **Step 3: Реализация**

```php
<?php
namespace App\Services\Wordstat;

class WordstatEstimator
{
    public static function estimate(int $seedCount, array $settings): array
    {
        $seeds = max(0, $seedCount);
        $depth = ((int) ($settings['depth'] ?? 0)) > 0 ? (int) ($settings['depth_max_seeds'] ?? 0) : 0;

        return ['seeds' => $seeds, 'depth' => $depth, 'total' => $seeds + $depth];
    }
}
```

- [ ] **Step 4: PASS**

Run: `/opt/homebrew/opt/php@7.4/bin/php vendor/bin/phpunit tests/Unit/Wordstat/WordstatEstimatorTest.php`
Expected: `OK (2 tests, 2 assertions)`

- [ ] **Step 5: Коммит**

```bash
git add app/Services/Wordstat/WordstatEstimator.php tests/Unit/Wordstat/WordstatEstimatorTest.php
git commit -m "feat(wordstat): request estimate"
```

---

### Task 5: Клиент Wordstat API и лимитер скорости

**Files:**
- Create: `app/Services/Wordstat/WordstatResult.php`, `WordstatException.php`, `WordstatClient.php`, `WordstatRateLimiter.php`
- Test: `tests/Unit/Wordstat/WordstatClientTest.php`

**Interfaces:**
- Produces:
  - `WordstatResult` — публичные свойства `int $totalCount`, `array $left` (`[['phrase' => string, 'count' => int], …]`), `array $right` (тот же формат).
  - `WordstatException extends \RuntimeException` — `isRetryable(): bool`, `static retryable(string $msg)`, `static fatal(string $msg)`.
  - `new WordstatClient(string $endpoint, string $user, string $key, ?callable $transport = null)`; `$transport(string $url): ?string` — по умолчанию HTTP GET с таймаутом `config('cabinet-wordstat-keywords.http_timeout')`; `words(string $query, array $regionIds, string $device, int $limit): WordstatResult`; `buildUrl(string $query, array $regionIds, string $device, int $limit): string`.
  - `WordstatClient::fromConfig(): WordstatClient` — `config('cabinet-wordstat-keywords.endpoint')`, `config('xmlstock.user')`, `config('xmlstock.key')`.
  - `WordstatRateLimiter::acquire(): void` — не более `limit()` запросов в секунду на сервер (файловый lock, как `PositionCollectRateLimiter`); `limit()` читает `MonitoringSettings` ключ `wordstat_rps`, дефолт `config('cabinet-wordstat-keywords.rps_default')`.
- Формат ошибки API (проверено 2026-11-23): `{"query":"…","error":{"code":-34,"message":"Не корректный ID пользователя или ключ"}}`. Фатальные: код `-34`, либо сообщение содержит `ключ`, `баланс`, `средств`, `заблокир`. Остальные ошибки, пустой/битый ответ и HTTP-сбой — retryable.

- [ ] **Step 1: Тест**

```php
<?php
namespace Tests\Unit\Wordstat;

use App\Services\Wordstat\WordstatClient;
use App\Services\Wordstat\WordstatException;
use PHPUnit\Framework\TestCase;

class WordstatClientTest extends TestCase
{
    private function client(?string $body, ?string &$calledUrl = null): WordstatClient
    {
        return new WordstatClient('https://api.test/wordstat/json/', 'u1', 'k1', function (string $url) use ($body, &$calledUrl) {
            $calledUrl = $url;

            return $body;
        });
    }

    public function testParsesColumnsAndBuildsUrl(): void
    {
        $body = json_encode([
            'totalCount' => '122908',
            'results' => [['phrase' => 'натяжные потолки', 'count' => '122908'], ['phrase' => 'натяжные потолки цена', 'count' => '8234']],
            'associations' => [['phrase' => 'подвесной потолок', 'count' => '13255']],
        ]);
        $url = null;
        $r = $this->client($body, $url)->words('натяжные потолки', [213, 2], 'phone', 200);

        $this->assertSame(122908, $r->totalCount);
        $this->assertSame(['phrase' => 'натяжные потолки цена', 'count' => 8234], $r->left[1]);
        $this->assertSame([['phrase' => 'подвесной потолок', 'count' => 13255]], $r->right);
        $this->assertStringContainsString('user=u1', $url);
        $this->assertStringContainsString('regions=213%2C2', $url);
        $this->assertStringContainsString('device=phone', $url);
        $this->assertStringContainsString('groupby=200', $url);
        $this->assertStringContainsString('pagetype=words', $url);
    }

    public function testFatalAuthError(): void
    {
        $this->expectException(WordstatException::class);
        try {
            $this->client('{"query":"x","error":{"code":-34,"message":"Не корректный ID пользователя или ключ"}}')->words('x', [213], 'all', 10);
        } catch (WordstatException $e) {
            $this->assertFalse($e->isRetryable());
            throw $e;
        }
    }

    public function testRetryableOnRateLimitAndHttpFailure(): void
    {
        foreach (['{"error":{"code":-55,"message":"Превышено количество запросов в секунду"}}', null, 'not json'] as $body) {
            try {
                $this->client($body)->words('x', [213], 'all', 10);
                $this->fail('expected exception');
            } catch (WordstatException $e) {
                $this->assertTrue($e->isRetryable());
            }
        }
    }

    public function testEmptyColumnsAreNotError(): void
    {
        $r = $this->client('{"totalCount":"0","results":[],"associations":[]}')->words('ыыы', [213], 'all', 10);
        $this->assertSame(0, $r->totalCount);
        $this->assertSame([], $r->left);
    }
}
```

- [ ] **Step 2: FAIL**

Run: `/opt/homebrew/opt/php@7.4/bin/php vendor/bin/phpunit tests/Unit/Wordstat/WordstatClientTest.php`
Expected: FAIL, класс не найден.

- [ ] **Step 3: Реализация**

```php
<?php
namespace App\Services\Wordstat;

class WordstatResult
{
    public int $totalCount = 0;
    /** @var array<int, array{phrase: string, count: int}> */
    public array $left = [];
    /** @var array<int, array{phrase: string, count: int}> */
    public array $right = [];
}
```

```php
<?php
namespace App\Services\Wordstat;

class WordstatException extends \RuntimeException
{
    private bool $retryable;

    public function __construct(string $message, bool $retryable)
    {
        parent::__construct($message);
        $this->retryable = $retryable;
    }

    public static function retryable(string $message): self
    {
        return new self($message, true);
    }

    public static function fatal(string $message): self
    {
        return new self($message, false);
    }

    public function isRetryable(): bool
    {
        return $this->retryable;
    }
}
```

```php
<?php
namespace App\Services\Wordstat;

class WordstatClient
{
    private string $endpoint;
    private string $user;
    private string $key;
    /** @var callable */
    private $transport;

    public function __construct(string $endpoint, string $user, string $key, ?callable $transport = null)
    {
        $this->endpoint = $endpoint;
        $this->user = $user;
        $this->key = $key;
        $this->transport = $transport ?? [$this, 'httpGet'];
    }

    public static function fromConfig(): self
    {
        return new self(
            (string) config('cabinet-wordstat-keywords.endpoint'),
            (string) config('xmlstock.user'),
            (string) config('xmlstock.key')
        );
    }

    public function buildUrl(string $query, array $regionIds, string $device, int $limit): string
    {
        return $this->endpoint . '?' . http_build_query([
            'user' => $this->user,
            'key' => $this->key,
            'query' => $query,
            'pagetype' => 'words',
            'groupby' => max(1, min(2000, $limit)),
            'regions' => implode(',', $regionIds),
            'device' => $device,
        ]);
    }

    public function words(string $query, array $regionIds, string $device, int $limit): WordstatResult
    {
        $body = ($this->transport)($this->buildUrl($query, $regionIds, $device, $limit));
        if ($body === null || $body === '') {
            throw WordstatException::retryable('empty response');
        }

        $json = json_decode($body, true);
        if (! is_array($json)) {
            throw WordstatException::retryable('invalid json');
        }

        if (isset($json['error'])) {
            $code = (int) ($json['error']['code'] ?? 0);
            $message = (string) ($json['error']['message'] ?? 'error');
            if ($code === -34 || preg_match('/ключ|баланс|средств|заблокир/ui', $message)) {
                throw WordstatException::fatal($message);
            }
            throw WordstatException::retryable($message);
        }

        $result = new WordstatResult();
        $result->totalCount = (int) ($json['totalCount'] ?? 0);
        $result->left = self::rows($json['results'] ?? []);
        $result->right = self::rows($json['associations'] ?? []);

        return $result;
    }

    private static function rows($items): array
    {
        $out = [];
        foreach ((array) $items as $item) {
            $phrase = trim((string) ($item['phrase'] ?? ''));
            if ($phrase !== '') {
                $out[] = ['phrase' => $phrase, 'count' => (int) ($item['count'] ?? 0)];
            }
        }

        return $out;
    }

    public function httpGet(string $url): ?string
    {
        $context = stream_context_create([
            'http' => ['timeout' => (int) config('cabinet-wordstat-keywords.http_timeout', 30), 'ignore_errors' => true],
        ]);
        $body = @file_get_contents($url, false, $context);

        return $body === false ? null : $body;
    }
}
```

```php
<?php
namespace App\Services\Wordstat;

use App\MonitoringSettings;
use Illuminate\Support\Facades\Cache;

class WordstatRateLimiter
{
    public const SETTING = 'wordstat_rps';
    private const CACHE_KEY = 'wordstat.rps';

    public static function limit(): int
    {
        return (int) Cache::remember(self::CACHE_KEY, 15, function () {
            $raw = (new MonitoringSettings())->getValue(self::SETTING);
            $value = $raw === false || $raw === null || $raw === '' ? (int) config('cabinet-wordstat-keywords.rps_default', 5) : (int) $raw;

            return max(1, min(100, $value));
        });
    }

    public static function acquire(): void
    {
        $rps = self::limit();
        $path = storage_path('framework/wordstat-rps.json');
        $deadline = microtime(true) + 120;

        while (microtime(true) < $deadline) {
            $fp = fopen($path, 'c+');
            if ($fp === false) {
                usleep(50000);
                continue;
            }
            try {
                if (! flock($fp, LOCK_EX)) {
                    usleep(20000);
                    continue;
                }
                $state = json_decode(stream_get_contents($fp) ?: '', true);
                $window = time();
                if (! is_array($state) || (int) ($state['window'] ?? 0) !== $window) {
                    $state = ['window' => $window, 'count' => 0];
                }
                if ((int) $state['count'] < $rps) {
                    $state['count'] = (int) $state['count'] + 1;
                    ftruncate($fp, 0);
                    rewind($fp);
                    fwrite($fp, json_encode($state));
                    fflush($fp);

                    return;
                }
            } finally {
                flock($fp, LOCK_UN);
                fclose($fp);
            }
            usleep(100000);
        }
    }
}
```

Перед реализацией проверить, что класс `App\MonitoringSettings` и метод `getValue()` существуют (их использует `PositionCollectRateLimiter`): `rg -n "function getValue" app/MonitoringSettings.php`.

- [ ] **Step 4: PASS**

Run: `/opt/homebrew/opt/php@7.4/bin/php vendor/bin/phpunit tests/Unit/Wordstat/WordstatClientTest.php`
Expected: `OK (4 tests, …)`

- [ ] **Step 5: Коммит**

```bash
git add app/Services/Wordstat/WordstatResult.php app/Services/Wordstat/WordstatException.php app/Services/Wordstat/WordstatClient.php app/Services/Wordstat/WordstatRateLimiter.php tests/Unit/Wordstat/WordstatClientTest.php
git commit -m "feat(wordstat): API client with error classification and rate limiter"
```

---

### Task 6: Сборщик и джобы

**Files:**
- Create: `app/Services/Wordstat/WordstatCollector.php`
- Create: `app/Jobs/Wordstat/StartWordstatRun.php`, `app/Jobs/Wordstat/CollectWordstatSeed.php`
- Test: `tests/Feature/Wordstat/WordstatCollectorTest.php`

**Interfaces:**
- Consumes: модели Task 1, `WordstatSettings`, `WordstatPhraseKey`, `WordstatPhraseFilter`, `WordstatEstimator`, `WordstatClient`, `WordstatException`, `WordstatRateLimiter`.
- Produces:
  - `new WordstatCollector(WordstatClient $client, bool $throttle = true)`; в контейнере — `app(WordstatCollector::class)` (биндинг через `fromConfig`).
  - `createRun(WordstatProject $project, int $userId, array $seeds, array $settings): WordstatRun` — `$seeds` из `WordstatInputParser::parse()['seeds']`; создаёт недостающие группы, `wordstat_run_seeds`, считает `requests_estimated`; статус `queued`. Затравок больше `max_seeds_per_run` — `\InvalidArgumentException`.
  - `collectSeed(WordstatRunSeed $seed): void` — делает запрос, сохраняет фразы, ставит дочерние затравки, закрывает seed как `done`; бросает `WordstatException`.
  - `failSeed(WordstatRunSeed $seed, string $error): void`, `failRun(WordstatRun $run, string $error): void`, `cancelRun(WordstatRun $run): void`.
  - Джобы: `StartWordstatRun(int $runId)`, `CollectWordstatSeed(int $seedId)`; очередь `config('cabinet-wordstat-keywords.queue')`.

Правила сохранения фразы (одна фраза — одна группа в проекте):
- сама затравка сохраняется с `freq = totalCount`, `source = manual` (если `depth = 0`) или `left` (дочерняя);
- кандидаты: `left` (если колонка включена), `right` (если включена); пропускаются фразы с минус-словами;
- есть запись с тем же `phrase_key` в проекте: если в той же группе — обновить `freq`, иначе не трогать;
- нет записи — вставить `status = active`, `group_id = seed.group_id`, `depth = seed.depth`, `seed_phrase_id` = id записи затравки, `run_id`;
- дочерние затравки: только из новых `left`-фраз, если `seed.depth < settings.depth` и в run ещё не набрано `depth_max_seeds` дочерних; лимит выдачи для дочерних — `depth_left_limit`.

- [ ] **Step 1: Тест**

```php
<?php
namespace Tests\Feature\Wordstat;

use App\Jobs\Wordstat\CollectWordstatSeed;
use App\Services\Wordstat\WordstatClient;
use App\Services\Wordstat\WordstatCollector;
use App\Services\Wordstat\WordstatException;
use App\Wordstat\WordstatPhrase;
use App\Wordstat\WordstatProject;
use App\Wordstat\WordstatRun;
use App\Wordstat\WordstatRunSeed;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class WordstatCollectorTest extends TestCase
{
    use DatabaseTransactions;

    private function collector(array $responses): WordstatCollector
    {
        $client = new WordstatClient('https://api.test/', 'u', 'k', function (string $url) use (&$responses) {
            parse_str((string) parse_url($url, PHP_URL_QUERY), $q);

            return $responses[$q['query']] ?? '{"totalCount":"0","results":[],"associations":[]}';
        });

        return new WordstatCollector($client, false);
    }

    private function project(): WordstatProject
    {
        return WordstatProject::query()->create(['user_id' => 999001, 'domain' => 'example.ru', 'region_ids' => [213]]);
    }

    public function testCollectsIntoGroupsWithoutDuplicates(): void
    {
        $collector = $this->collector([
            'окна' => json_encode([
                'totalCount' => '1000',
                'results' => [['phrase' => 'окна', 'count' => '1000'], ['phrase' => 'окна пвх', 'count' => '300'], ['phrase' => 'окна бесплатно', 'count' => '5']],
                'associations' => [['phrase' => 'стеклопакеты', 'count' => '200']],
            ]),
            'двери' => json_encode([
                'totalCount' => '500',
                'results' => [['phrase' => 'двери', 'count' => '500'], ['phrase' => 'окна пвх', 'count' => '300']],
                'associations' => [],
            ]),
        ]);
        $project = $this->project();
        $run = $collector->createRun($project, 999001, [
            ['group' => 'Окна', 'phrase' => 'окна'],
            ['group' => 'Двери', 'phrase' => 'двери'],
        ], ['minus_words' => ['бесплатно']]);

        $this->assertSame(2, (int) $run->requests_estimated);

        foreach ($run->seeds()->orderBy('id')->get() as $seed) {
            $collector->collectSeed($seed);
        }

        $phrases = WordstatPhrase::query()->where('project_id', $project->id)->get()->keyBy('phrase');
        $this->assertEqualsCanonicalizing(['окна', 'окна пвх', 'стеклопакеты', 'двери'], $phrases->keys()->all());
        $this->assertSame(1000, $phrases['окна']->freq);
        $this->assertSame('manual', $phrases['окна']->source);
        $this->assertSame('right', $phrases['стеклопакеты']->source);
        $this->assertSame($phrases['окна']->group_id, $phrases['окна пвх']->group_id);

        $run->refresh();
        $this->assertSame(WordstatRun::STATUS_DONE, $run->status);
        $this->assertSame(2, (int) $run->seeds_done);
        $this->assertSame(2, (int) $run->requests_used);
        $this->assertSame(4, (int) $run->phrases_added);
        $this->assertSame(2, \DB::table('wordstat_request_log')->where('run_id', $run->id)->count());
    }

    public function testDepthCreatesChildSeedsWithinCap(): void
    {
        Queue::fake();
        $collector = $this->collector([
            'окна' => json_encode([
                'totalCount' => '1000',
                'results' => [['phrase' => 'окна', 'count' => '1000'], ['phrase' => 'окна пвх', 'count' => '300'], ['phrase' => 'окна дерево', 'count' => '100']],
                'associations' => [],
            ]),
        ]);
        $run = $collector->createRun($this->project(), 999001, [['group' => 'Окна', 'phrase' => 'окна']], ['depth' => 1, 'depth_max_seeds' => 1]);

        $collector->collectSeed($run->seeds()->first());

        $children = $run->seeds()->where('depth', 1)->get();
        $this->assertCount(1, $children);
        $this->assertSame('окна пвх', $children[0]->phrase);
        $this->assertSame(2, (int) $run->fresh()->seeds_total);
        $this->assertSame(WordstatRun::STATUS_RUNNING, $run->fresh()->status);
        Queue::assertPushed(CollectWordstatSeed::class, 1);
    }

    public function testCancelledRunSkipsSeeds(): void
    {
        $collector = $this->collector([]);
        $run = $collector->createRun($this->project(), 999001, [['group' => 'А', 'phrase' => 'окна']], []);
        $collector->cancelRun($run);

        $this->assertSame(WordstatRun::STATUS_CANCELLED, $run->fresh()->status);
        $this->assertSame(WordstatRunSeed::STATUS_SKIPPED, $run->seeds()->first()->status);
    }

    public function testFatalErrorFailsRun(): void
    {
        $collector = $this->collector(['окна' => '{"error":{"code":-34,"message":"Не корректный ID пользователя или ключ"}}']);
        $run = $collector->createRun($this->project(), 999001, [['group' => 'А', 'phrase' => 'окна']], []);

        try {
            $collector->collectSeed($run->seeds()->first());
            $this->fail('expected exception');
        } catch (WordstatException $e) {
            $this->assertFalse($e->isRetryable());
            $collector->failRun($run, $e->getMessage());
        }

        $this->assertSame(WordstatRun::STATUS_FAILED, $run->fresh()->status);
    }
}
```

- [ ] **Step 2: FAIL**

Run: `/opt/homebrew/opt/php@7.4/bin/php vendor/bin/phpunit tests/Feature/Wordstat/WordstatCollectorTest.php`
Expected: FAIL, `WordstatCollector` не найден.

- [ ] **Step 3: Реализация сборщика**

```php
<?php
namespace App\Services\Wordstat;

use App\Jobs\Wordstat\CollectWordstatSeed;
use App\Wordstat\WordstatGroup;
use App\Wordstat\WordstatPhrase;
use App\Wordstat\WordstatProject;
use App\Wordstat\WordstatRequestLog;
use App\Wordstat\WordstatRun;
use App\Wordstat\WordstatRunSeed;
use Illuminate\Support\Facades\DB;

class WordstatCollector
{
    private WordstatClient $client;
    private bool $throttle;

    public function __construct(WordstatClient $client, bool $throttle = true)
    {
        $this->client = $client;
        $this->throttle = $throttle;
    }

    public function createRun(WordstatProject $project, int $userId, array $seeds, array $settings): WordstatRun
    {
        $max = (int) config('cabinet-wordstat-keywords.max_seeds_per_run', 500);
        if (count($seeds) === 0 || count($seeds) > $max) {
            throw new \InvalidArgumentException('seeds count out of range');
        }
        $settings = WordstatSettings::normalize($settings);
        $estimate = WordstatEstimator::estimate(count($seeds), $settings);

        return DB::transaction(function () use ($project, $userId, $seeds, $settings, $estimate) {
            $run = WordstatRun::query()->create([
                'project_id' => $project->id,
                'user_id' => $userId,
                'settings' => $settings,
                'status' => WordstatRun::STATUS_QUEUED,
                'seeds_total' => count($seeds),
                'requests_estimated' => $estimate['total'],
            ]);

            $groupIds = [];
            $position = (int) WordstatGroup::query()->where('project_id', $project->id)->max('position');
            foreach ($seeds as $seed) {
                $name = (string) $seed['group'];
                if (! isset($groupIds[$name])) {
                    $group = WordstatGroup::query()->firstOrCreate(
                        ['project_id' => $project->id, 'name' => $name],
                        ['source' => 'manual', 'position' => ++$position]
                    );
                    $groupIds[$name] = $group->id;
                }
                WordstatRunSeed::query()->create([
                    'run_id' => $run->id,
                    'group_id' => $groupIds[$name],
                    'phrase' => (string) $seed['phrase'],
                    'depth' => 0,
                ]);
            }

            return $run;
        });
    }

    public function collectSeed(WordstatRunSeed $seed): void
    {
        $run = WordstatRun::query()->findOrFail($seed->run_id);
        if (! $run->isActive() || $seed->status !== WordstatRunSeed::STATUS_QUEUED) {
            return;
        }
        if ($run->status === WordstatRun::STATUS_QUEUED) {
            $run->update(['status' => WordstatRun::STATUS_RUNNING, 'started_at' => now()]);
        }

        $settings = WordstatSettings::normalize((array) $run->settings);
        $query = WordstatPhraseFilter::stripStopWords($seed->phrase, $settings['stop_words']);
        $limit = $seed->depth === 0 ? $settings['left_limit'] : $settings['depth_left_limit'];

        if ($this->throttle) {
            WordstatRateLimiter::acquire();
        }
        $result = $this->client->words($query !== '' ? $query : $seed->phrase, $settings['region_ids'], $settings['device'], $limit);
        WordstatRequestLog::query()->create([
            'user_id' => $run->user_id, 'project_id' => $run->project_id, 'run_id' => $run->id, 'kind' => 'words', 'created_at' => now(),
        ]);

        $added = 0;
        $newLeft = [];

        DB::transaction(function () use ($seed, $run, $settings, $result, &$added, &$newLeft) {
            $seedRow = $this->upsertPhrase($run, $seed, $seed->phrase, $result->totalCount, $seed->depth === 0 ? WordstatPhrase::SOURCE_MANUAL : WordstatPhrase::SOURCE_LEFT, null, $added);
            $seedPhraseId = $seedRow ? $seedRow->id : null;

            $candidates = [];
            if (in_array('left', $settings['columns'], true)) {
                foreach ($result->left as $row) {
                    $candidates[] = [$row, WordstatPhrase::SOURCE_LEFT];
                }
            }
            if (in_array('right', $settings['columns'], true)) {
                foreach ($result->right as $row) {
                    $candidates[] = [$row, WordstatPhrase::SOURCE_RIGHT];
                }
            }

            foreach ($candidates as [$row, $source]) {
                if (WordstatPhraseFilter::hasMinusWord($row['phrase'], $settings['minus_words'])) {
                    continue;
                }
                $before = $added;
                $this->upsertPhrase($run, $seed, $row['phrase'], $row['count'], $source, $seedPhraseId, $added);
                if ($added > $before && $source === WordstatPhrase::SOURCE_LEFT) {
                    $newLeft[] = $row['phrase'];
                }
            }
        });

        $this->queueChildren($run, $seed, $settings, $newLeft);
        $seed->update(['status' => WordstatRunSeed::STATUS_DONE, 'requests_used' => 1]);
        $this->bumpRun($run->id, 1, $added);
    }

    private function upsertPhrase(WordstatRun $run, WordstatRunSeed $seed, string $phrase, int $freq, string $source, ?int $seedPhraseId, int &$added): ?WordstatPhrase
    {
        $key = WordstatPhraseKey::make($phrase);
        if ($key === '') {
            return null;
        }
        $existing = WordstatPhrase::query()->where('project_id', $run->project_id)->where('phrase_key', $key)->first();
        if ($existing) {
            if ((int) $existing->group_id === (int) $seed->group_id) {
                $existing->update(['freq' => $freq]);
            }

            return $existing;
        }
        $added++;

        return WordstatPhrase::query()->create([
            'project_id' => $run->project_id,
            'group_id' => $seed->group_id,
            'phrase' => $phrase,
            'phrase_key' => $key,
            'freq' => $freq,
            'source' => $source,
            'seed_phrase_id' => $seedPhraseId,
            'depth' => $seed->depth,
            'status' => WordstatPhrase::STATUS_ACTIVE,
            'run_id' => $run->id,
        ]);
    }

    private function queueChildren(WordstatRun $run, WordstatRunSeed $seed, array $settings, array $phrases): void
    {
        if ($seed->depth >= $settings['depth'] || $phrases === []) {
            return;
        }
        $already = WordstatRunSeed::query()->where('run_id', $run->id)->where('depth', '>', 0)->count();
        $room = $settings['depth_max_seeds'] - $already;
        if ($room <= 0) {
            return;
        }
        $created = 0;
        foreach (array_slice($phrases, 0, $room) as $phrase) {
            $child = WordstatRunSeed::query()->create([
                'run_id' => $run->id, 'group_id' => $seed->group_id, 'phrase' => $phrase, 'depth' => $seed->depth + 1,
            ]);
            $created++;
            CollectWordstatSeed::dispatch($child->id)->onQueue(config('cabinet-wordstat-keywords.queue'));
        }
        WordstatRun::query()->where('id', $run->id)->increment('seeds_total', $created);
    }

    private function bumpRun(int $runId, int $requests, int $added): void
    {
        DB::transaction(function () use ($runId, $requests, $added) {
            $run = WordstatRun::query()->lockForUpdate()->findOrFail($runId);
            $run->seeds_done = (int) $run->seeds_done + 1;
            $run->requests_used = (int) $run->requests_used + $requests;
            $run->phrases_added = (int) $run->phrases_added + $added;
            if ($run->seeds_done >= $run->seeds_total && $run->isActive()) {
                $run->status = WordstatRun::STATUS_DONE;
                $run->finished_at = now();
            }
            $run->save();
        });
    }

    public function failSeed(WordstatRunSeed $seed, string $error): void
    {
        $seed->update(['status' => WordstatRunSeed::STATUS_FAILED, 'error' => mb_substr($error, 0, 1000)]);
        $this->bumpRun((int) $seed->run_id, 0, 0);
    }

    public function failRun(WordstatRun $run, string $error): void
    {
        $run->update(['status' => WordstatRun::STATUS_FAILED, 'error' => mb_substr($error, 0, 1000), 'finished_at' => now()]);
        WordstatRunSeed::query()->where('run_id', $run->id)->where('status', WordstatRunSeed::STATUS_QUEUED)
            ->update(['status' => WordstatRunSeed::STATUS_SKIPPED]);
    }

    public function cancelRun(WordstatRun $run): void
    {
        if (! $run->isActive()) {
            return;
        }
        $run->update(['status' => WordstatRun::STATUS_CANCELLED, 'finished_at' => now()]);
        WordstatRunSeed::query()->where('run_id', $run->id)->where('status', WordstatRunSeed::STATUS_QUEUED)
            ->update(['status' => WordstatRunSeed::STATUS_SKIPPED]);
    }
}
```

`queueChildren` вызывается после `DB::transaction` в `collectSeed`, поэтому дочерние затравки уже закоммичены к моменту, когда воркер возьмёт джобу.

- [ ] **Step 4: Джобы и биндинг**

```php
<?php
namespace App\Jobs\Wordstat;

use App\Wordstat\WordstatRun;
use App\Wordstat\WordstatRunSeed;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class StartWordstatRun implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 1;
    private int $runId;

    public function __construct(int $runId)
    {
        $this->runId = $runId;
    }

    public function handle(): void
    {
        $run = WordstatRun::query()->find($this->runId);
        if (! $run || ! $run->isActive()) {
            return;
        }
        $ids = WordstatRunSeed::query()->where('run_id', $run->id)->where('status', WordstatRunSeed::STATUS_QUEUED)->pluck('id');
        foreach ($ids as $id) {
            CollectWordstatSeed::dispatch((int) $id)->onQueue(config('cabinet-wordstat-keywords.queue'));
        }
    }
}
```

```php
<?php
namespace App\Jobs\Wordstat;

use App\Services\Wordstat\WordstatCollector;
use App\Services\Wordstat\WordstatException;
use App\Wordstat\WordstatRunSeed;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class CollectWordstatSeed implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 5;
    public $timeout = 180;
    private int $seedId;

    public function __construct(int $seedId)
    {
        $this->seedId = $seedId;
    }

    public function handle(WordstatCollector $collector): void
    {
        $seed = WordstatRunSeed::query()->find($this->seedId);
        if (! $seed) {
            return;
        }

        try {
            $collector->collectSeed($seed);
        } catch (WordstatException $e) {
            Log::warning('wordstat.seed_error', ['seed_id' => $seed->id, 'retryable' => $e->isRetryable(), 'message' => $e->getMessage()]);
            if (! $e->isRetryable()) {
                $collector->failRun($seed->run, $e->getMessage());

                return;
            }
            $delays = (array) config('cabinet-wordstat-keywords.retry_delays', [10, 30, 90, 90]);
            if ($this->attempts() < $this->tries) {
                $this->release((int) ($delays[$this->attempts() - 1] ?? 90));

                return;
            }
            $collector->failSeed($seed, $e->getMessage());
        }
    }
}
```

В `app/Providers/AppServiceProvider.php` в `register()`:

```php
        $this->app->bind(\App\Services\Wordstat\WordstatCollector::class, function () {
            return new \App\Services\Wordstat\WordstatCollector(\App\Services\Wordstat\WordstatClient::fromConfig());
        });
```

- [ ] **Step 5: PASS**

Run: `/opt/homebrew/opt/php@7.4/bin/php vendor/bin/phpunit tests/Feature/Wordstat/WordstatCollectorTest.php`
Expected: `OK (4 tests, …)`

- [ ] **Step 6: Коммит**

```bash
git add app/Services/Wordstat/WordstatCollector.php app/Jobs/Wordstat app/Providers/AppServiceProvider.php tests/Feature/Wordstat/WordstatCollectorTest.php
git commit -m "feat(wordstat): background collector with depth, minus words and run lifecycle"
```

---

### Task 7: Меню, право, маршруты, контроллер сбора

**Files:**
- Create: `database/migrations/2026_11_24_100100_add_wordstat_keywords_menu_and_permission.php`
- Create: `app/Http/Controllers/WordstatKeywordsController.php`
- Modify: `routes/web.php` (после блока `search-suggestions`, ~строка 466)
- Modify: `resources/lang/ru.json` (`"Wordstat keywords": "Подбор слов Wordstat"`)
- Test: `tests/Feature/Wordstat/WordstatControllerTest.php`

**Interfaces:**
- Consumes: `WordstatInputParser::parse`, `WordstatSettings::normalize`, `WordstatEstimator::estimate`, `WordstatCollector::createRun|cancelRun`, `StartWordstatRun`.
- Produces маршруты (все `->middleware('permission:Wordstat keywords')`, `{id}` и `{runId}` — `[0-9]+`):

| Метод | URI | Имя | Ответ |
|---|---|---|---|
| GET | `wordstat-keywords` | `pages.wordstat-keywords` | список проектов |
| POST | `wordstat-keywords` | `pages.wordstat-keywords.store` | JSON `{ok, redirect}` / redirect |
| GET | `wordstat-keywords/{id}` | `pages.wordstat-keywords.show` | страница проекта |
| POST | `wordstat-keywords/{id}/delete` | `pages.wordstat-keywords.destroy` | JSON `{ok, redirect}` |
| POST | `wordstat-keywords/{id}/preview` | `pages.wordstat-keywords.preview` | JSON `{ok, groups, seeds, rejected, estimate}` |
| POST | `wordstat-keywords/{id}/runs` | `pages.wordstat-keywords.runs.store` | JSON `{ok, run}` |
| GET | `wordstat-keywords/{id}/runs/{runId}` | `pages.wordstat-keywords.runs.show` | JSON `{ok, run}` |
| POST | `wordstat-keywords/{id}/runs/{runId}/cancel` | `pages.wordstat-keywords.runs.cancel` | JSON `{ok, run}` |

`run` в JSON: `{id, status, seeds_total, seeds_done, requests_estimated, requests_used, phrases_added, error, active}`.

- [ ] **Step 1: Миграция меню и права**

Скопировать `database/migrations/2026_07_31_150100_add_seo_checklist_menu_and_permission.php` в новый файл, класс `AddWordstatKeywordsMenuAndPermission`, заменить:
- `PARENT_PROJECT_ID` — id пункта «Поисковые подсказки»: в `seedMenuItem()` перед `$parent = …` взять `DB::table('main_projects')->where('link', 'like', '%/search-suggestions%')->first()`, иначе как в оригинале (id 40, затем 13);
- `'%/seo-checklist%'` → `'%/wordstat-keywords%'` (в `seedMenuItem` и `removeMenuItem`);
- `'controller' => "WordstatKeywordsController@index\r\n"`, `'color' => '#7c3aed'`, `'title' => 'Wordstat keywords'`, `'description' => 'Сбор ключевых слов из Wordstat по группам.'`, `'link' => 'https://lk.redbox.su/wordstat-keywords'`, `'icon' => '<i class="fas fa-key"></i>'`;
- `'SEO Checklist'` → `'Wordstat keywords'` во всех трёх методах права;
- `assignPermissionLikeSiteAudit`: брать роли права `'Search suggestions'`, затем `'Site audit'`;
- убрать блок `ensureSystemTemplate()` из `up()`.

Run: `/opt/homebrew/opt/php@8.5/bin/php artisan migrate`
Expected: `Migrated: 2026_11_24_100100_add_wordstat_keywords_menu_and_permission`

- [ ] **Step 2: Тест контроллера**

```php
<?php
namespace Tests\Feature\Wordstat;

use App\Jobs\Wordstat\StartWordstatRun;
use App\User;
use App\Wordstat\WordstatProject;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class WordstatControllerTest extends TestCase
{
    use DatabaseTransactions;

    private function user(): User
    {
        $user = User::query()->whereNotNull('email_verified_at')->get()->first(fn (User $u) => $u->can('Wordstat keywords'));
        if (! $user) {
            $this->markTestSkipped('Нет пользователя с правом Wordstat keywords');
        }

        return $user;
    }

    public function testPreviewAndStartRun(): void
    {
        Queue::fake();
        $user = $this->user();
        $project = WordstatProject::query()->create(['user_id' => $user->id, 'domain' => 'example.ru', 'region_ids' => [213]]);

        $preview = $this->actingAs($user)->postJson(route('pages.wordstat-keywords.preview', $project->id), [
            'text' => "Окна: окна пвх\nдвери",
            'settings' => ['depth' => 1, 'depth_max_seeds' => 10],
        ]);
        $preview->assertOk()->assertJson(['ok' => true, 'estimate' => ['total' => 12]]);
        $this->assertCount(2, $preview->json('seeds'));

        $start = $this->actingAs($user)->postJson(route('pages.wordstat-keywords.runs.store', $project->id), [
            'text' => "Окна: окна пвх\nдвери",
            'settings' => [],
        ]);
        $start->assertOk()->assertJson(['ok' => true, 'run' => ['status' => 'queued', 'seeds_total' => 2]]);
        Queue::assertPushed(StartWordstatRun::class);

        $runId = $start->json('run.id');
        $this->actingAs($user)->getJson(route('pages.wordstat-keywords.runs.show', [$project->id, $runId]))
            ->assertOk()->assertJson(['run' => ['id' => $runId, 'active' => true]]);
        $this->actingAs($user)->postJson(route('pages.wordstat-keywords.runs.cancel', [$project->id, $runId]))
            ->assertOk()->assertJson(['run' => ['status' => 'cancelled']]);
    }

    public function testForeignProjectIs404(): void
    {
        $user = $this->user();
        $project = WordstatProject::query()->create(['user_id' => 999001, 'domain' => 'x.ru', 'region_ids' => [213]]);
        $this->actingAs($user)->postJson(route('pages.wordstat-keywords.preview', $project->id), ['text' => 'окна'])->assertNotFound();
    }

    public function testEmptyInputIs422(): void
    {
        $user = $this->user();
        $project = WordstatProject::query()->create(['user_id' => $user->id, 'domain' => 'example.ru', 'region_ids' => [213]]);
        $this->actingAs($user)->postJson(route('pages.wordstat-keywords.runs.store', $project->id), ['text' => "  \n "])
            ->assertStatus(422)->assertJson(['ok' => false]);
    }
}
```

- [ ] **Step 3: FAIL**

Run: `/opt/homebrew/opt/php@7.4/bin/php vendor/bin/phpunit tests/Feature/Wordstat/WordstatControllerTest.php`
Expected: FAIL, `Route [pages.wordstat-keywords.preview] not defined`.

- [ ] **Step 4: Маршруты**

В `routes/web.php` после строки `Route::delete('search-suggestions/history/{id}', …);`:

```php
    Route::get('wordstat-keywords', 'WordstatKeywordsController@index')->name('pages.wordstat-keywords')->middleware('permission:Wordstat keywords');
    Route::post('wordstat-keywords', 'WordstatKeywordsController@store')->name('pages.wordstat-keywords.store')->middleware('permission:Wordstat keywords');
    Route::get('wordstat-keywords/{id}', 'WordstatKeywordsController@show')->name('pages.wordstat-keywords.show')->middleware('permission:Wordstat keywords')->where('id', '[0-9]+');
    Route::post('wordstat-keywords/{id}/delete', 'WordstatKeywordsController@destroy')->name('pages.wordstat-keywords.destroy')->middleware('permission:Wordstat keywords')->where('id', '[0-9]+');
    Route::post('wordstat-keywords/{id}/preview', 'WordstatKeywordsController@preview')->name('pages.wordstat-keywords.preview')->middleware('permission:Wordstat keywords')->where('id', '[0-9]+');
    Route::post('wordstat-keywords/{id}/runs', 'WordstatKeywordsController@startRun')->name('pages.wordstat-keywords.runs.store')->middleware('permission:Wordstat keywords')->where('id', '[0-9]+');
    Route::get('wordstat-keywords/{id}/runs/{runId}', 'WordstatKeywordsController@runStatus')->name('pages.wordstat-keywords.runs.show')->middleware('permission:Wordstat keywords')->where(['id' => '[0-9]+', 'runId' => '[0-9]+']);
    Route::post('wordstat-keywords/{id}/runs/{runId}/cancel', 'WordstatKeywordsController@cancelRun')->name('pages.wordstat-keywords.runs.cancel')->middleware('permission:Wordstat keywords')->where(['id' => '[0-9]+', 'runId' => '[0-9]+']);
```

- [ ] **Step 5: Контроллер (часть сбора)**

```php
<?php
namespace App\Http\Controllers;

use App\Jobs\Wordstat\StartWordstatRun;
use App\Services\Wordstat\WordstatCollector;
use App\Services\Wordstat\WordstatEstimator;
use App\Services\Wordstat\WordstatInputParser;
use App\Services\Wordstat\WordstatSettings;
use App\Support\YandexLrRegions;
use App\Wordstat\WordstatGroup;
use App\Wordstat\WordstatPreset;
use App\Wordstat\WordstatProject;
use App\Wordstat\WordstatRequestLog;
use App\Wordstat\WordstatRun;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WordstatKeywordsController extends Controller
{
    public function index()
    {
        $userId = (int) Auth::id();
        $projects = WordstatProject::query()->accessibleBy($userId)->orderByDesc('id')
            ->withCount(['groups', 'phrases' => fn ($q) => $q->where('status', 'active')])
            ->get();

        return view('wordstat-keywords.index', [
            'projects' => $projects,
            'teams' => app(\App\Services\SeoChecklist\SeoChecklistService::class)->teamsForUser($userId),
            'monthRequests' => $this->monthRequests($userId),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'domain' => 'required|string|max:255',
            'title' => 'nullable|string|max:255',
            'region_ids' => 'nullable|array',
            'team_id' => 'nullable|integer',
        ]);
        $userId = (int) Auth::id();
        $teamId = (int) ($data['team_id'] ?? 0);
        if ($teamId && ! in_array($teamId, WordstatProject::teamIdsForMember($userId), true)) {
            $teamId = 0;
        }
        $domain = preg_replace('#^https?://(www\.)?#i', '', trim($data['domain']));
        $domain = rtrim(mb_strtolower($domain), '/');

        $project = WordstatProject::query()->create([
            'user_id' => $userId,
            'team_id' => $teamId ?: null,
            'domain' => $domain,
            'title' => $data['title'] ?? null,
            'region_ids' => WordstatSettings::normalize(['region_ids' => $data['region_ids'] ?? []])['region_ids'],
            'device' => 'all',
        ]);
        $url = route('pages.wordstat-keywords.show', $project->id);

        return $request->expectsJson()
            ? response()->json(['ok' => true, 'message' => __('Проект создан'), 'redirect' => $url])
            : redirect($url);
    }

    public function show(int $id)
    {
        $project = $this->project($id);
        $userId = (int) Auth::id();
        $groups = WordstatGroup::query()->where('project_id', $project->id)->orderBy('position')->orderBy('id')
            ->withCount(['phrases' => fn ($q) => $q->where('status', 'active')])
            ->get();
        $activeRun = WordstatRun::query()->where('project_id', $project->id)->whereIn('status', ['queued', 'running'])->latest('id')->first();

        return view('wordstat-keywords.show', [
            'project' => $project,
            'groups' => $groups,
            'presets' => WordstatPreset::query()->visibleTo($userId)->orderBy('title')->get(),
            'regions' => YandexLrRegions::resolveMany(array_map('strval', (array) $project->region_ids), 100),
            'activeRun' => $activeRun ? $this->runPayload($activeRun) : null,
            'lastRuns' => WordstatRun::query()->where('project_id', $project->id)->latest('id')->limit(5)->get(),
            'monthRequests' => $this->monthRequests($userId),
        ]);
    }

    public function destroy(Request $request, int $id)
    {
        $project = $this->project($id);
        abort_unless((int) $project->user_id === (int) Auth::id(), 403);
        $project->delete();
        $url = route('pages.wordstat-keywords');

        return $request->expectsJson()
            ? response()->json(['ok' => true, 'message' => __('Проект удалён'), 'redirect' => $url])
            : redirect($url);
    }

    public function preview(Request $request, int $id): JsonResponse
    {
        $project = $this->project($id);
        [$parsed, $settings] = $this->parseRequest($request, $project);
        $groups = array_values(array_unique(array_column($parsed['seeds'], 'group')));

        return response()->json([
            'ok' => true,
            'groups' => $groups,
            'seeds' => $parsed['seeds'],
            'rejected' => $parsed['rejected'],
            'estimate' => WordstatEstimator::estimate(count($parsed['seeds']), $settings),
        ]);
    }

    public function startRun(Request $request, int $id, WordstatCollector $collector): JsonResponse
    {
        $project = $this->project($id);
        if (WordstatRun::query()->where('project_id', $project->id)->whereIn('status', ['queued', 'running'])->exists()) {
            return response()->json(['ok' => false, 'message' => __('Сбор по проекту уже идёт — дождитесь окончания или остановите его')], 422);
        }
        [$parsed, $settings] = $this->parseRequest($request, $project);
        $max = (int) config('cabinet-wordstat-keywords.max_seeds_per_run', 500);
        if (count($parsed['seeds']) === 0) {
            return response()->json(['ok' => false, 'message' => __('Введите хотя бы одну фразу')], 422);
        }
        if (count($parsed['seeds']) > $max) {
            return response()->json(['ok' => false, 'message' => __('Слишком много фраз за один запуск. Максимум: :max', ['max' => number_format($max, 0, '', ' ')])], 422);
        }

        $run = $collector->createRun($project, (int) Auth::id(), $parsed['seeds'], $settings);
        StartWordstatRun::dispatch($run->id)->onQueue(config('cabinet-wordstat-keywords.queue'));

        return response()->json(['ok' => true, 'message' => __('Сбор запущен'), 'run' => $this->runPayload($run->fresh())]);
    }

    public function runStatus(int $id, int $runId): JsonResponse
    {
        $project = $this->project($id);
        $run = WordstatRun::query()->where('project_id', $project->id)->findOrFail($runId);

        return response()->json(['ok' => true, 'run' => $this->runPayload($run)]);
    }

    public function cancelRun(int $id, int $runId, WordstatCollector $collector): JsonResponse
    {
        $project = $this->project($id);
        $run = WordstatRun::query()->where('project_id', $project->id)->findOrFail($runId);
        $collector->cancelRun($run);

        return response()->json(['ok' => true, 'message' => __('Сбор остановлен'), 'run' => $this->runPayload($run->fresh())]);
    }

    private function project(int $id): WordstatProject
    {
        $project = WordstatProject::query()->findOrFail($id);
        abort_unless($project->isAccessibleBy((int) Auth::id()), 404);

        return $project;
    }

    private function parseRequest(Request $request, WordstatProject $project): array
    {
        $settings = (array) $request->input('settings', []);
        if (! isset($settings['region_ids']) || $settings['region_ids'] === []) {
            $settings['region_ids'] = (array) $project->region_ids;
        }
        $settings = WordstatSettings::normalize($settings);
        $parsed = WordstatInputParser::parse(
            (string) $request->input('text', ''),
            (string) $request->input('group', WordstatGroup::DEFAULT_NAME) ?: WordstatGroup::DEFAULT_NAME,
            (int) config('cabinet-wordstat-keywords.max_phrase_length', 400),
            (int) config('cabinet-wordstat-keywords.max_phrase_words', 7)
        );

        return [$parsed, $settings];
    }

    private function runPayload(WordstatRun $run): array
    {
        return [
            'id' => $run->id,
            'status' => $run->status,
            'seeds_total' => (int) $run->seeds_total,
            'seeds_done' => (int) $run->seeds_done,
            'requests_estimated' => (int) $run->requests_estimated,
            'requests_used' => (int) $run->requests_used,
            'phrases_added' => (int) $run->phrases_added,
            'error' => $run->error ? __('Сбор частотности временно недоступен, попробуйте позже') : null,
            'active' => $run->isActive(),
        ];
    }

    private function monthRequests(int $userId): int
    {
        return WordstatRequestLog::query()->where('user_id', $userId)->where('created_at', '>=', now()->startOfMonth())->count();
    }
}
```

Перед реализацией проверить сигнатуру `SeoChecklistService::teamsForUser` и поле названия команды (`rg -n "function teamsForUser" -A10 app/Services/SeoChecklist/SeoChecklistService.php`, `rg -n "fillable" -A5 app/SeoChecklist/SeoChecklistTeam.php`; в `index.blade.php` используется `$t->name` — заменить, если поле называется иначе) и что `App\Support\YandexLrRegions::resolveMany(array $ids, int $max)` возвращает `[{id, name, text}]`.

- [ ] **Step 6: PASS**

Run: `/opt/homebrew/opt/php@7.4/bin/php vendor/bin/phpunit tests/Feature/Wordstat/WordstatControllerTest.php`
Expected: `OK (3 tests, …)` (или `skipped`, если у локальных пользователей нет права — тогда выдать право роли `Super Admin` локально и повторить).

- [ ] **Step 7: Коммит**

```bash
git add database/migrations/2026_11_24_100100_add_wordstat_keywords_menu_and_permission.php app/Http/Controllers/WordstatKeywordsController.php routes/web.php resources/lang/ru.json tests/Feature/Wordstat/WordstatControllerTest.php
git commit -m "feat(wordstat): menu, permission, routes and run controller"
```

---

### Task 8: Пресеты, действия с группами и фразами, выгрузка

**Files:**
- Modify: `app/Http/Controllers/WordstatKeywordsController.php`
- Modify: `routes/web.php`
- Create: `app/Exports/WordstatPhrasesExport.php`
- Test: `tests/Feature/Wordstat/WordstatEditingTest.php`

**Interfaces:**
- Produces маршруты (все с `permission:Wordstat keywords`):

| Метод | URI | Имя | Тело / ответ |
|---|---|---|---|
| GET | `wordstat-keywords/{id}/phrases` | `pages.wordstat-keywords.phrases` | `?group_id=&status=active` → `{ok, phrases:[{id, phrase, freq, source, depth, group_id, status}]}` |
| POST | `wordstat-keywords/{id}/phrases/bulk` | `pages.wordstat-keywords.phrases.bulk` | `{ids:[], action:'move'|'minus'|'restore'|'delete', group_id?}` → `{ok, affected}` |
| POST | `wordstat-keywords/{id}/groups/{groupId}` | `pages.wordstat-keywords.groups.update` | `{name}` → `{ok, group}` |
| POST | `wordstat-keywords/{id}/groups/{groupId}/merge` | `pages.wordstat-keywords.groups.merge` | `{target_id}` → `{ok}` |
| POST | `wordstat-keywords/{id}/groups/{groupId}/delete` | `pages.wordstat-keywords.groups.destroy` | → `{ok}` (фразы группы удаляются физически) |
| GET | `wordstat-keywords/{id}/export` | `pages.wordstat-keywords.export` | `?group_id=` → XLSX |
| POST | `wordstat-keywords/presets` | `pages.wordstat-keywords.presets.store` | `{title, settings, team_id?, preset_id?}` → `{ok, preset:{id,title,settings,team_id,mine}}` |
| POST | `wordstat-keywords/presets/{presetId}/delete` | `pages.wordstat-keywords.presets.destroy` | → `{ok}` |

Правило пресетов: видит владелец и участники команды `team_id`; изменять и удалять — только автор (`user_id`).

- [ ] **Step 1: Тест**

```php
<?php
namespace Tests\Feature\Wordstat;

use App\User;
use App\Wordstat\WordstatGroup;
use App\Wordstat\WordstatPhrase;
use App\Wordstat\WordstatPreset;
use App\Wordstat\WordstatProject;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class WordstatEditingTest extends TestCase
{
    use DatabaseTransactions;

    private function user(): User
    {
        $user = User::query()->whereNotNull('email_verified_at')->get()->first(fn (User $u) => $u->can('Wordstat keywords'));
        if (! $user) {
            $this->markTestSkipped('Нет пользователя с правом Wordstat keywords');
        }

        return $user;
    }

    private function seed(User $user): array
    {
        $project = WordstatProject::query()->create(['user_id' => $user->id, 'domain' => 'example.ru', 'region_ids' => [213]]);
        $a = WordstatGroup::query()->create(['project_id' => $project->id, 'name' => 'А']);
        $b = WordstatGroup::query()->create(['project_id' => $project->id, 'name' => 'Б']);
        $p1 = WordstatPhrase::query()->create(['project_id' => $project->id, 'group_id' => $a->id, 'phrase' => 'окна', 'phrase_key' => 'окна', 'freq' => 1000, 'source' => 'manual']);
        $p2 = WordstatPhrase::query()->create(['project_id' => $project->id, 'group_id' => $a->id, 'phrase' => 'окна пвх', 'phrase_key' => 'окна пвх', 'freq' => 300, 'source' => 'left']);

        return [$project, $a, $b, $p1, $p2];
    }

    public function testBulkMoveMinusAndMerge(): void
    {
        $user = $this->user();
        [$project, $a, $b, $p1, $p2] = $this->seed($user);

        $this->actingAs($user)->postJson(route('pages.wordstat-keywords.phrases.bulk', $project->id), ['ids' => [$p2->id], 'action' => 'move', 'group_id' => $b->id])
            ->assertOk()->assertJson(['affected' => 1]);
        $this->assertSame($b->id, (int) $p2->fresh()->group_id);

        $this->actingAs($user)->postJson(route('pages.wordstat-keywords.phrases.bulk', $project->id), ['ids' => [$p1->id], 'action' => 'minus'])->assertOk();
        $this->assertSame('minus', $p1->fresh()->status);

        $this->actingAs($user)->postJson(route('pages.wordstat-keywords.groups.merge', [$project->id, $b->id]), ['target_id' => $a->id])->assertOk();
        $this->assertNull(WordstatGroup::query()->find($b->id));
        $this->assertSame($a->id, (int) $p2->fresh()->group_id);

        $list = $this->actingAs($user)->getJson(route('pages.wordstat-keywords.phrases', $project->id) . '?group_id=' . $a->id);
        $list->assertOk();
        $this->assertSame(['окна пвх'], array_column($list->json('phrases'), 'phrase'));
    }

    public function testRenameGroupRejectsDuplicateName(): void
    {
        $user = $this->user();
        [$project, $a] = $this->seed($user);
        $this->actingAs($user)->postJson(route('pages.wordstat-keywords.groups.update', [$project->id, $a->id]), ['name' => 'Б'])->assertStatus(422);
        $this->actingAs($user)->postJson(route('pages.wordstat-keywords.groups.update', [$project->id, $a->id]), ['name' => 'Окна'])
            ->assertOk()->assertJson(['group' => ['name' => 'Окна']]);
    }

    public function testPresetCrudAndOwnership(): void
    {
        $user = $this->user();
        $res = $this->actingAs($user)->postJson(route('pages.wordstat-keywords.presets.store'), [
            'title' => 'Москва, обе колонки', 'settings' => ['region_ids' => [213], 'left_limit' => 500],
        ]);
        $res->assertOk()->assertJson(['preset' => ['title' => 'Москва, обе колонки', 'mine' => true]]);
        $this->assertSame(500, WordstatPreset::query()->find($res->json('preset.id'))->settings['left_limit']);

        $foreign = WordstatPreset::query()->create(['user_id' => 999001, 'title' => 'чужой', 'settings' => []]);
        $this->actingAs($user)->postJson(route('pages.wordstat-keywords.presets.destroy', $foreign->id))->assertNotFound();
    }

    public function testExportReturnsXlsx(): void
    {
        $user = $this->user();
        [$project] = $this->seed($user);
        $res = $this->actingAs($user)->get(route('pages.wordstat-keywords.export', $project->id));
        $res->assertOk();
        $this->assertStringContainsString('spreadsheetml', (string) $res->headers->get('content-type'));
    }
}
```

- [ ] **Step 2: FAIL**

Run: `/opt/homebrew/opt/php@7.4/bin/php vendor/bin/phpunit tests/Feature/Wordstat/WordstatEditingTest.php`
Expected: FAIL, маршруты не определены.

- [ ] **Step 3: Маршруты**

Добавить после маршрутов Task 7 (пресеты — **до** `wordstat-keywords/{id}`, чтобы `presets` не путался с `{id}`; у `{id}` есть `where` на цифры, так что порядок не критичен, но держим пресеты выше):

```php
    Route::post('wordstat-keywords/presets', 'WordstatKeywordsController@storePreset')->name('pages.wordstat-keywords.presets.store')->middleware('permission:Wordstat keywords');
    Route::post('wordstat-keywords/presets/{presetId}/delete', 'WordstatKeywordsController@destroyPreset')->name('pages.wordstat-keywords.presets.destroy')->middleware('permission:Wordstat keywords')->where('presetId', '[0-9]+');
    Route::get('wordstat-keywords/{id}/phrases', 'WordstatKeywordsController@phrases')->name('pages.wordstat-keywords.phrases')->middleware('permission:Wordstat keywords')->where('id', '[0-9]+');
    Route::post('wordstat-keywords/{id}/phrases/bulk', 'WordstatKeywordsController@bulkPhrases')->name('pages.wordstat-keywords.phrases.bulk')->middleware('permission:Wordstat keywords')->where('id', '[0-9]+');
    Route::post('wordstat-keywords/{id}/groups/{groupId}', 'WordstatKeywordsController@updateGroup')->name('pages.wordstat-keywords.groups.update')->middleware('permission:Wordstat keywords')->where(['id' => '[0-9]+', 'groupId' => '[0-9]+']);
    Route::post('wordstat-keywords/{id}/groups/{groupId}/merge', 'WordstatKeywordsController@mergeGroup')->name('pages.wordstat-keywords.groups.merge')->middleware('permission:Wordstat keywords')->where(['id' => '[0-9]+', 'groupId' => '[0-9]+']);
    Route::post('wordstat-keywords/{id}/groups/{groupId}/delete', 'WordstatKeywordsController@destroyGroup')->name('pages.wordstat-keywords.groups.destroy')->middleware('permission:Wordstat keywords')->where(['id' => '[0-9]+', 'groupId' => '[0-9]+']);
    Route::get('wordstat-keywords/{id}/export', 'WordstatKeywordsController@export')->name('pages.wordstat-keywords.export')->middleware('permission:Wordstat keywords')->where('id', '[0-9]+');
```

- [ ] **Step 4: Методы контроллера**

Добавить в `WordstatKeywordsController` (импорты: `App\Exports\WordstatPhrasesExport`, `App\Wordstat\WordstatPhrase`, `Maatwebsite\Excel\Facades\Excel`):

```php
    public function phrases(Request $request, int $id): JsonResponse
    {
        $project = $this->project($id);
        $status = in_array($request->query('status'), ['active', 'minus'], true) ? $request->query('status') : 'active';
        $query = WordstatPhrase::query()->where('project_id', $project->id)->where('status', $status);
        if ($request->filled('group_id')) {
            $query->where('group_id', (int) $request->query('group_id'));
        }
        $rows = $query->orderByDesc('freq')->limit(20000)
            ->get(['id', 'phrase', 'freq', 'source', 'depth', 'group_id', 'status']);

        return response()->json(['ok' => true, 'phrases' => $rows]);
    }

    public function bulkPhrases(Request $request, int $id): JsonResponse
    {
        $project = $this->project($id);
        $data = $request->validate([
            'ids' => 'required|array|max:20000',
            'ids.*' => 'integer',
            'action' => 'required|in:move,minus,restore,delete',
            'group_id' => 'nullable|integer',
        ]);
        $query = WordstatPhrase::query()->where('project_id', $project->id)->whereIn('id', $data['ids']);

        switch ($data['action']) {
            case 'move':
                $group = WordstatGroup::query()->where('project_id', $project->id)->findOrFail((int) ($data['group_id'] ?? 0));
                $affected = $query->update(['group_id' => $group->id]);
                break;
            case 'minus':
                $affected = $query->update(['status' => WordstatPhrase::STATUS_MINUS]);
                break;
            case 'restore':
                $affected = $query->update(['status' => WordstatPhrase::STATUS_ACTIVE]);
                break;
            default:
                $affected = $query->delete();
        }

        return response()->json(['ok' => true, 'affected' => (int) $affected]);
    }

    public function updateGroup(Request $request, int $id, int $groupId): JsonResponse
    {
        $project = $this->project($id);
        $group = WordstatGroup::query()->where('project_id', $project->id)->findOrFail($groupId);
        $name = mb_substr(trim(preg_replace('/\s+/u', ' ', (string) $request->input('name', ''))), 0, 255);
        if ($name === '') {
            return response()->json(['ok' => false, 'message' => __('Введите название группы')], 422);
        }
        $taken = WordstatGroup::query()->where('project_id', $project->id)->where('name', $name)->where('id', '!=', $group->id)->exists();
        if ($taken) {
            return response()->json(['ok' => false, 'message' => __('Группа с таким названием уже есть')], 422);
        }
        $group->update(['name' => $name]);

        return response()->json(['ok' => true, 'group' => ['id' => $group->id, 'name' => $group->name]]);
    }

    public function mergeGroup(Request $request, int $id, int $groupId): JsonResponse
    {
        $project = $this->project($id);
        $source = WordstatGroup::query()->where('project_id', $project->id)->findOrFail($groupId);
        $target = WordstatGroup::query()->where('project_id', $project->id)->findOrFail((int) $request->input('target_id'));
        abort_if($source->id === $target->id, 422);
        WordstatPhrase::query()->where('group_id', $source->id)->update(['group_id' => $target->id]);
        $source->delete();

        return response()->json(['ok' => true, 'message' => __('Группы объединены')]);
    }

    public function destroyGroup(int $id, int $groupId): JsonResponse
    {
        $project = $this->project($id);
        $group = WordstatGroup::query()->where('project_id', $project->id)->findOrFail($groupId);
        WordstatPhrase::query()->where('group_id', $group->id)->delete();
        $group->delete();

        return response()->json(['ok' => true, 'message' => __('Группа удалена')]);
    }

    public function export(Request $request, int $id)
    {
        $project = $this->project($id);
        $groupId = $request->filled('group_id') ? (int) $request->query('group_id') : null;
        $name = 'wordstat-' . preg_replace('/[^a-z0-9.-]+/i', '-', $project->domain) . '-' . now()->format('Y-m-d') . '.xlsx';

        return Excel::download(new WordstatPhrasesExport($project->id, $groupId), $name);
    }

    public function storePreset(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'settings' => 'nullable|array',
            'team_id' => 'nullable|integer',
            'preset_id' => 'nullable|integer',
        ]);
        $userId = (int) Auth::id();
        $teamId = (int) ($data['team_id'] ?? 0);
        if ($teamId && ! in_array($teamId, WordstatProject::teamIdsForMember($userId), true)) {
            $teamId = 0;
        }
        $attrs = [
            'title' => trim($data['title']),
            'settings' => WordstatSettings::normalize((array) ($data['settings'] ?? [])),
            'team_id' => $teamId ?: null,
        ];
        if (! empty($data['preset_id'])) {
            $preset = WordstatPreset::query()->where('user_id', $userId)->findOrFail((int) $data['preset_id']);
            $preset->update($attrs);
        } else {
            $preset = WordstatPreset::query()->create($attrs + ['user_id' => $userId]);
        }

        return response()->json(['ok' => true, 'message' => __('Пресет сохранён'), 'preset' => [
            'id' => $preset->id, 'title' => $preset->title, 'settings' => $preset->settings, 'team_id' => $preset->team_id, 'mine' => true,
        ]]);
    }

    public function destroyPreset(int $presetId): JsonResponse
    {
        $preset = WordstatPreset::query()->where('user_id', (int) Auth::id())->findOrFail($presetId);
        $preset->delete();

        return response()->json(['ok' => true, 'message' => __('Пресет удалён')]);
    }
```

- [ ] **Step 5: Выгрузка**

```php
<?php
namespace App\Exports;

use App\Wordstat\WordstatGroup;
use App\Wordstat\WordstatPhrase;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class WordstatPhrasesExport implements FromArray, WithHeadings
{
    private int $projectId;
    private ?int $groupId;

    public function __construct(int $projectId, ?int $groupId = null)
    {
        $this->projectId = $projectId;
        $this->groupId = $groupId;
    }

    public function headings(): array
    {
        return ['Группа', 'Фраза', 'Частотность', 'Точная частотность', 'Источник'];
    }

    public function array(): array
    {
        $groups = WordstatGroup::query()->where('project_id', $this->projectId)->pluck('name', 'id');
        $sources = ['left' => 'Левая колонка', 'right' => 'Правая колонка', 'manual' => 'Своя фраза'];
        $query = WordstatPhrase::query()->where('project_id', $this->projectId)->where('status', WordstatPhrase::STATUS_ACTIVE);
        if ($this->groupId) {
            $query->where('group_id', $this->groupId);
        }

        return $query->orderBy('group_id')->orderByDesc('freq')->get()->map(fn (WordstatPhrase $p) => [
            (string) ($groups[$p->group_id] ?? ''),
            $p->phrase,
            $p->freq,
            $p->freq_exact,
            $sources[$p->source] ?? $p->source,
        ])->all();
    }
}
```

- [ ] **Step 6: PASS**

Run: `/opt/homebrew/opt/php@7.4/bin/php vendor/bin/phpunit tests/Feature/Wordstat`
Expected: `OK` (все feature-тесты модуля).

- [ ] **Step 7: Коммит**

```bash
git add app/Http/Controllers/WordstatKeywordsController.php app/Exports/WordstatPhrasesExport.php routes/web.php tests/Feature/Wordstat/WordstatEditingTest.php
git commit -m "feat(wordstat): presets, group and phrase actions, XLSX export"
```

---

### Task 9: Страницы, JS, CSS

**Files:**
- Create: `resources/views/wordstat-keywords/index.blade.php`, `resources/views/wordstat-keywords/show.blade.php`
- Create: `public/js/cabinet-wordstat-keywords.js`, `public/css/cabinet-wordstat-keywords.css`
- Test: `scripts/smoke-wordstat-keywords.php`

**Interfaces:**
- Consumes: маршруты Task 7–8; переменные `show`: `$project, $groups, $presets, $regions, $activeRun, $lastRuns, $monthRequests`; `index`: `$projects, $teams, $monthRequests`.
- Produces DOM-контракт для JS: корень `#cabinetWskPage.cabinet-wsk-page` с `data-*` URL; `<script type="application/json" id="cabinetWskData">` с `{groups, presets, activeRun, regions, defaults}`.

- [ ] **Step 1: Список проектов `index.blade.php`**

```blade
@component('component.card', [
    'title' => __('Wordstat keywords'),
    'titleHtml' => e(__('Wordstat keywords')) . view('partials.cabinet-module-version-badge', ['configKey' => 'cabinet-wordstat-keywords'])->render(),
])
    @slot('css')
        <link rel="stylesheet" href="{{ asset('plugins/select2/css/select2.min.css') }}">
        <link rel="stylesheet" href="{{ asset('plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css') }}">
        <link rel="stylesheet" href="{{ asset('css/cabinet-wordstat-keywords.css') }}?v={{ @filemtime(public_path('css/cabinet-wordstat-keywords.css')) ?: time() }}">
    @endslot

    <div class="cabinet-wsk-page" id="cabinetWskPage" data-regions-url="{{ route('cluster.regions') }}">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="text-muted small">{{ __('Запросов к Wordstat в этом месяце') }}: <strong>{{ number_format($monthRequests, 0, '', ' ') }}</strong></div>
            <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#cabinetWskCreateModal">
                <i class="bi bi-plus-lg"></i> {{ __('Новый проект') }}
            </button>
        </div>

        @if ($projects->isEmpty())
            <div class="cabinet-wsk-empty">{{ __('Проектов пока нет. Создайте проект на сайт и соберите ключевые слова.') }}</div>
        @else
            <div class="table-responsive">
                <table class="table table-sm align-middle cabinet-wsk-projects">
                    <thead><tr><th>{{ __('Сайт') }}</th><th class="text-end">{{ __('Групп') }}</th><th class="text-end">{{ __('Фраз') }}</th><th>{{ __('Создан') }}</th></tr></thead>
                    <tbody>
                    @foreach ($projects as $p)
                        <tr>
                            <td><a href="{{ route('pages.wordstat-keywords.show', $p->id) }}">{{ $p->domain }}</a>@if ($p->title) <span class="text-muted">· {{ $p->title }}</span>@endif</td>
                            <td class="text-end">{{ number_format($p->groups_count, 0, '', ' ') }}</td>
                            <td class="text-end">{{ number_format($p->phrases_count, 0, '', ' ') }}</td>
                            <td>{{ $p->created_at->format('d.m.Y') }}</td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>
        @endif

        <div class="modal fade" id="cabinetWskCreateModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <form class="modal-content" method="post" action="{{ route('pages.wordstat-keywords.store') }}" data-ajax-form>
                    @csrf
                    <div class="modal-header"><h5 class="modal-title">{{ __('Новый проект') }}</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="{{ __('Закрыть') }}"></button></div>
                    <div class="modal-body">
                        <label class="form-label">{{ __('Сайт') }}</label>
                        <input type="text" name="domain" class="form-control mb-2" placeholder="example.ru" required>
                        <label class="form-label">{{ __('Название (необязательно)') }}</label>
                        <input type="text" name="title" class="form-control mb-2">
                        <label class="form-label">{{ __('Регион по умолчанию') }}</label>
                        <select name="region_ids[]" class="form-select" data-wsk-region-select multiple><option value="213" selected>Москва</option></select>
                        @if (count($teams))
                            <label class="form-label mt-2">{{ __('Команда (необязательно)') }}</label>
                            <select name="team_id" class="form-select"><option value=""></option>@foreach ($teams as $t)<option value="{{ $t->id }}">{{ $t->name }}</option>@endforeach</select>
                        @endif
                    </div>
                    <div class="modal-footer"><button type="submit" class="btn btn-primary">{{ __('Создать') }}</button></div>
                </form>
            </div>
        </div>
    </div>

    @slot('js')
        <script src="{{ asset('plugins/select2/js/select2.full.min.js') }}"></script>
        <script src="{{ asset('js/cabinet-ajax-form.js') }}?v={{ @filemtime(public_path('js/cabinet-ajax-form.js')) ?: time() }}"></script>
        <script src="{{ asset('js/cabinet-wordstat-keywords.js') }}?v={{ @filemtime(public_path('js/cabinet-wordstat-keywords.js')) ?: time() }}"></script>
    @endslot
@endcomponent
```

Перед вёрсткой проверить имена слотов `component.card` (`css`, `js`) и атрибуты модалки (BS5 `data-bs-*` или BS4 `data-toggle`) на `resources/views/pages/search-suggestions.blade.php` и `seo-reports.blade.php`; использовать те же.

- [ ] **Step 2: Страница проекта `show.blade.php`**

Разметка (внутри того же `component.card`, слоты css/js как в Step 1):

```blade
<div class="cabinet-wsk-page" id="cabinetWskPage"
     data-preview-url="{{ route('pages.wordstat-keywords.preview', $project->id) }}"
     data-run-url="{{ route('pages.wordstat-keywords.runs.store', $project->id) }}"
     data-run-status-url="{{ url('/wordstat-keywords/' . $project->id . '/runs') }}"
     data-phrases-url="{{ route('pages.wordstat-keywords.phrases', $project->id) }}"
     data-bulk-url="{{ route('pages.wordstat-keywords.phrases.bulk', $project->id) }}"
     data-groups-url="{{ url('/wordstat-keywords/' . $project->id . '/groups') }}"
     data-export-url="{{ route('pages.wordstat-keywords.export', $project->id) }}"
     data-preset-store-url="{{ route('pages.wordstat-keywords.presets.store') }}"
     data-preset-delete-url="{{ url('/wordstat-keywords/presets') }}"
     data-regions-url="{{ route('cluster.regions') }}"
     data-csrf="{{ csrf_token() }}">

    <script type="application/json" id="cabinetWskData">@json([
        'groups' => $groups->map(fn ($g) => ['id' => $g->id, 'name' => $g->name, 'count' => $g->phrases_count])->values(),
        'presets' => $presets->map(fn ($p) => ['id' => $p->id, 'title' => $p->title, 'settings' => $p->settings, 'team_id' => $p->team_id, 'mine' => (int) $p->user_id === (int) auth()->id()])->values(),
        'activeRun' => $activeRun,
        'regions' => $regions,
        'defaults' => \App\Services\Wordstat\WordstatSettings::normalize(['region_ids' => $project->region_ids]),
    ])</script>

    <div class="cabinet-wsk-head">
        <div><strong>{{ $project->domain }}</strong> <span class="text-muted small">{{ __('Запросов в этом месяце') }}: {{ number_format($monthRequests, 0, '', ' ') }}</span></div>
        <a class="btn btn-outline-secondary btn-sm" href="{{ route('pages.wordstat-keywords.export', $project->id) }}"><i class="bi bi-file-earmark-excel"></i> {{ __('Выгрузить XLSX') }}</a>
    </div>

    <section class="cabinet-wsk-collect card card-body mb-3">
        <div class="row g-3">
            <div class="col-lg-7">
                <label class="form-label">{{ __('Фразы') }} @include('pages.partials.site-audit-tip', ['text' => __('Одна строка — одна фраза. Группа: «Группа: фраза», строка «# Группа» для блока фраз, или две колонки из Excel (группа, фраза).')])</label>
                <textarea class="form-control" rows="8" data-wsk-text placeholder="Окна: пластиковые окна&#10;# Потолки&#10;натяжные потолки"></textarea>
            </div>
            <div class="col-lg-5">
                <label class="form-label">{{ __('Пресет') }}</label>
                <div class="d-flex gap-2 mb-2"><select class="form-select" data-wsk-preset><option value=""></option></select><button type="button" class="btn btn-outline-danger btn-sm" data-wsk-preset-delete aria-label="{{ __('Удалить пресет') }}"><i class="bi bi-trash"></i></button></div>
                <label class="form-label">{{ __('Регионы') }}</label>
                <select class="form-select mb-2" data-wsk-region-select data-wsk-setting="region_ids" multiple></select>
                <div class="row g-2">
                    <div class="col-6"><label class="form-label">{{ __('Устройства') }}</label>
                        <select class="form-select form-select-sm" data-wsk-setting="device"><option value="all">{{ __('Все') }}</option><option value="desktop">{{ __('Компьютеры') }}</option><option value="phone">{{ __('Телефоны') }}</option><option value="tablet">{{ __('Планшеты') }}</option></select></div>
                    <div class="col-6"><label class="form-label">{{ __('Фраз из левой колонки') }}</label>
                        <input type="text" inputmode="numeric" class="form-control form-control-sm sa-num-space" data-wsk-setting="left_limit"></div>
                    <div class="col-12">
                        <div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" id="wskColLeft" value="left" data-wsk-column><label class="form-check-label" for="wskColLeft">{{ __('Левая колонка') }}</label></div>
                        <div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" id="wskColRight" value="right" data-wsk-column><label class="form-check-label" for="wskColRight">{{ __('Правая колонка') }}</label></div>
                    </div>
                    <div class="col-4"><label class="form-label">{{ __('Глубина') }} @include('pages.partials.site-audit-tip', ['text' => __('0 — только ваши фразы. 1–2 — дособрать по найденным фразам.')])</label>
                        <select class="form-select form-select-sm" data-wsk-setting="depth"><option value="0">0</option><option value="1">1</option><option value="2">2</option></select></div>
                    <div class="col-4"><label class="form-label">{{ __('Фраз при досборе') }}</label><input type="text" inputmode="numeric" class="form-control form-control-sm sa-num-space" data-wsk-setting="depth_left_limit"></div>
                    <div class="col-4"><label class="form-label">{{ __('Лимит досбора') }} @include('pages.partials.site-audit-tip', ['text' => __('Сколько найденных фраз максимум дособрать за запуск. Ограничивает расход запросов.')])</label><input type="text" inputmode="numeric" class="form-control form-control-sm sa-num-space" data-wsk-setting="depth_max_seeds"></div>
                </div>
                <label class="form-label mt-2">{{ __('Минус-слова') }}</label>
                <textarea class="form-control form-control-sm" rows="2" data-wsk-setting="minus_words" placeholder="бесплатно, своими руками"></textarea>
                <label class="form-label mt-2">{{ __('Стоп-слова') }} @include('pages.partials.site-audit-tip', ['text' => __('Слова вырезаются из ваших фраз перед запросом, например «купить».')])</label>
                <textarea class="form-control form-control-sm" rows="1" data-wsk-setting="stop_words"></textarea>
            </div>
        </div>
        <div class="cabinet-wsk-preview mt-3" data-wsk-preview hidden></div>
        <div class="d-flex gap-2 mt-3">
            <button type="button" class="btn btn-outline-primary" data-wsk-preview-btn>{{ __('Проверить') }}</button>
            <button type="button" class="btn btn-primary" data-wsk-run-btn>{{ __('Собрать') }}</button>
            <button type="button" class="btn btn-outline-secondary" data-wsk-preset-save>{{ __('Сохранить как пресет') }}</button>
        </div>
        <div class="cabinet-wsk-progress mt-3" data-wsk-progress hidden>
            <div class="progress"><div class="progress-bar" role="progressbar" style="width:0%"></div></div>
            <div class="small text-muted mt-1" data-wsk-progress-text></div>
            <button type="button" class="btn btn-link btn-sm text-danger p-0" data-wsk-cancel>{{ __('Остановить') }}</button>
        </div>
    </section>

    <div class="cabinet-wsk-body">
        <aside class="cabinet-wsk-groups" data-wsk-groups></aside>
        <section class="cabinet-wsk-table">
            <div class="d-flex gap-2 mb-2 align-items-center">
                <input type="search" class="form-control form-control-sm" placeholder="{{ __('Поиск по фразам') }}" data-wsk-search>
                <select class="form-select form-select-sm w-auto" data-wsk-bulk-action>
                    <option value="">{{ __('С выбранными…') }}</option>
                    <option value="move">{{ __('Перенести в группу') }}</option>
                    <option value="minus">{{ __('В минус') }}</option>
                    <option value="delete">{{ __('Удалить') }}</option>
                </select>
                <select class="form-select form-select-sm w-auto" data-wsk-bulk-group hidden></select>
                <button type="button" class="btn btn-sm btn-outline-primary" data-wsk-bulk-apply>{{ __('Применить') }}</button>
            </div>
            <div class="table-responsive cabinet-wsk-table__scroll">
                <table class="table table-sm table-hover">
                    <thead><tr>
                        <th class="cabinet-wsk-check"><input type="checkbox" class="form-check-input" data-wsk-check-all aria-label="{{ __('Выбрать все') }}"></th>
                        <th data-wsk-sort="phrase">{{ __('Фраза') }}</th>
                        <th class="text-end" data-wsk-sort="freq">{{ __('Частотность') }}</th>
                        <th>{{ __('Источник') }}</th>
                    </tr></thead>
                    <tbody data-wsk-rows></tbody>
                </table>
            </div>
        </section>
    </div>
</div>
```

Перед вёрсткой открыть `resources/views/pages/partials/site-audit-tip.blade.php` и передать параметры с теми именами, которые partial ожидает (если не `text` — заменить ключ во всех `@include`).

- [ ] **Step 3: JS `public/js/cabinet-wordstat-keywords.js`**

```js
(function ($) {
    'use strict';

    var page = document.getElementById('cabinetWskPage');
    if (!page) { return; }

    var ds = page.dataset;
    var dataEl = document.getElementById('cabinetWskData');
    var state = dataEl ? JSON.parse(dataEl.textContent) : { groups: [], presets: [], activeRun: null, regions: [], defaults: {} };
    var phrases = [];
    var currentGroupId = state.groups.length ? state.groups[0].id : null;
    var sort = { key: 'freq', dir: -1 };
    var pollTimer = null;

    var SOURCES = { left: 'Левая колонка', right: 'Правая колонка', manual: 'Своя фраза' };

    function fmt(n) { return n === null || n === undefined ? '' : String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
    function digits(v) { return parseInt(String(v || '').replace(/\D+/g, ''), 10) || 0; }
    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function toast(msg, ok) { if (window.CabinetAjaxForm && window.CabinetAjaxForm.toast) { window.CabinetAjaxForm.toast(msg, ok !== false); } }

    function request(url, method, body) {
        return fetch(url, {
            method: method || 'GET',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'X-CSRF-TOKEN': ds.csrf, 'X-Requested-With': 'XMLHttpRequest' },
            body: body ? JSON.stringify(body) : undefined,
            credentials: 'same-origin'
        }).then(function (r) {
            return r.json().catch(function () { return { ok: false }; }).then(function (j) {
                if (!r.ok || j.ok === false) { throw new Error(j.message || 'Не удалось выполнить действие'); }
                return j;
            });
        });
    }

    /* ---------- settings form ---------- */
    function regionSelect($el) {
        $el.select2({
            theme: 'bootstrap4', width: '100%', multiple: true,
            dropdownParent: $el.closest('.modal').length ? $el.closest('.modal') : undefined,
            ajax: { url: ds.regionsUrl, dataType: 'json', delay: 200, data: function (p) { return { q: p.term || '', engine: 'yandex' }; }, processResults: function (d) { return { results: d.results || [] }; } }
        });
    }

    function applySettings(s) {
        var $region = $('[data-wsk-setting="region_ids"]');
        $region.empty();
        (s.region_ids || []).forEach(function (id) {
            var known = (state.regions || []).filter(function (r) { return String(r.id) === String(id); })[0];
            $region.append(new Option(known ? known.text : String(id), id, true, true));
        });
        $region.trigger('change');
        $('[data-wsk-setting="device"]').val(s.device);
        $('[data-wsk-setting="left_limit"]').val(fmt(s.left_limit));
        $('[data-wsk-setting="depth"]').val(String(s.depth));
        $('[data-wsk-setting="depth_left_limit"]').val(fmt(s.depth_left_limit));
        $('[data-wsk-setting="depth_max_seeds"]').val(fmt(s.depth_max_seeds));
        $('[data-wsk-setting="minus_words"]').val((s.minus_words || []).join(', '));
        $('[data-wsk-setting="stop_words"]').val((s.stop_words || []).join(', '));
        $('[data-wsk-column]').each(function () { this.checked = (s.columns || []).indexOf(this.value) !== -1; });
    }

    function readSettings() {
        return {
            region_ids: $('[data-wsk-setting="region_ids"]').val() || [],
            device: $('[data-wsk-setting="device"]').val(),
            columns: $('[data-wsk-column]:checked').map(function () { return this.value; }).get(),
            left_limit: digits($('[data-wsk-setting="left_limit"]').val()),
            depth: parseInt($('[data-wsk-setting="depth"]').val(), 10) || 0,
            depth_left_limit: digits($('[data-wsk-setting="depth_left_limit"]').val()),
            depth_max_seeds: digits($('[data-wsk-setting="depth_max_seeds"]').val()),
            minus_words: $('[data-wsk-setting="minus_words"]').val(),
            stop_words: $('[data-wsk-setting="stop_words"]').val()
        };
    }

    $(document).on('input', '.sa-num-space', function () { var n = digits(this.value); this.value = n ? fmt(n) : ''; });

    /* ---------- presets ---------- */
    function renderPresets(selectedId) {
        var $p = $('[data-wsk-preset]');
        $p.empty().append(new Option('', ''));
        state.presets.forEach(function (p) { $p.append(new Option(p.title + (p.team_id ? ' · команда' : ''), p.id, false, String(p.id) === String(selectedId))); });
        $p.trigger('change.select2');
    }

    $(document).on('change', '[data-wsk-preset]', function () {
        var preset = state.presets.filter(function (p) { return String(p.id) === String(this.value); }, this)[0];
        if (preset) { applySettings(preset.settings); }
    });

    $(document).on('click', '[data-wsk-preset-save]', function () {
        var current = state.presets.filter(function (p) { return String(p.id) === String($('[data-wsk-preset]').val()) && p.mine; })[0];
        var title = window.prompt('Название пресета', current ? current.title : '');
        if (!title) { return; }
        request(ds.presetStoreUrl, 'POST', { title: title, settings: readSettings(), preset_id: current && current.title === title ? current.id : null })
            .then(function (j) {
                state.presets = state.presets.filter(function (p) { return p.id !== j.preset.id; }).concat([j.preset]);
                renderPresets(j.preset.id);
                toast(j.message);
            }).catch(function (e) { toast(e.message, false); });
    });

    $(document).on('click', '[data-wsk-preset-delete]', function () {
        var id = $('[data-wsk-preset]').val();
        var preset = state.presets.filter(function (p) { return String(p.id) === String(id); })[0];
        if (!preset || !preset.mine) { return; }
        request(ds.presetDeleteUrl + '/' + id + '/delete', 'POST').then(function (j) {
            state.presets = state.presets.filter(function (p) { return String(p.id) !== String(id); });
            renderPresets(null);
            toast(j.message);
        }).catch(function (e) { toast(e.message, false); });
    });

    /* ---------- preview & run ---------- */
    var REASONS = { too_long: 'длиннее 400 символов', too_many_words: 'больше 7 слов' };

    function payload() { return { text: $('[data-wsk-text]').val(), group: currentGroupName(), settings: readSettings() }; }
    function currentGroupName() { var g = state.groups.filter(function (x) { return x.id === currentGroupId; })[0]; return g ? g.name : ''; }

    $(document).on('click', '[data-wsk-preview-btn]', function () {
        request(ds.previewUrl, 'POST', payload()).then(function (j) {
            var html = '<div>Групп: <strong>' + fmt(j.groups.length) + '</strong> · фраз: <strong>' + fmt(j.seeds.length) +
                '</strong> · запросов примерно: <strong>' + fmt(j.estimate.total) + '</strong></div>';
            if (j.rejected.length) {
                html += '<div class="text-danger small mt-1">Пропущено: ' + j.rejected.map(function (r) { return esc(r.line) + ' (' + REASONS[r.reason] + ')'; }).join('; ') + '</div>';
            }
            $('[data-wsk-preview]').html(html).prop('hidden', false);
        }).catch(function (e) { toast(e.message, false); });
    });

    $(document).on('click', '[data-wsk-run-btn]', function () {
        var $btn = $(this).prop('disabled', true);
        request(ds.runUrl, 'POST', payload()).then(function (j) {
            toast(j.message);
            showRun(j.run);
        }).catch(function (e) { toast(e.message, false); }).finally(function () { $btn.prop('disabled', false); });
    });

    $(document).on('click', '[data-wsk-cancel]', function () {
        if (!state.activeRun) { return; }
        request(ds.runStatusUrl + '/' + state.activeRun.id + '/cancel', 'POST').then(function (j) { showRun(j.run); toast(j.message); });
    });

    function showRun(run) {
        state.activeRun = run;
        var $box = $('[data-wsk-progress]').prop('hidden', false);
        var pct = run.seeds_total ? Math.round(run.seeds_done * 100 / run.seeds_total) : 0;
        $box.find('.progress-bar').css('width', pct + '%');
        var text = 'Обработано фраз: ' + fmt(run.seeds_done) + ' из ' + fmt(run.seeds_total) +
            ' · новых фраз: ' + fmt(run.phrases_added) + ' · запросов: ' + fmt(run.requests_used);
        if (run.status === 'done') { text = 'Готово. ' + text; }
        if (run.status === 'cancelled') { text = 'Остановлено. ' + text; }
        if (run.status === 'failed') { text = run.error || 'Сбор не удался'; }
        $box.find('[data-wsk-progress-text]').text(text);
        $box.find('[data-wsk-cancel]').prop('hidden', !run.active);

        clearTimeout(pollTimer);
        if (run.active) {
            pollTimer = setTimeout(function () {
                request(ds.runStatusUrl + '/' + run.id).then(function (j) { showRun(j.run); });
            }, 3000);
        } else {
            reloadGroups();
        }
    }

    /* ---------- groups ---------- */
    function reloadGroups() {
        fetch(window.location.href, { credentials: 'same-origin' }).then(function (r) { return r.text(); }).then(function (html) {
            var doc = new DOMParser().parseFromString(html, 'text/html');
            var fresh = doc.getElementById('cabinetWskData');
            if (!fresh) { return; }
            state.groups = JSON.parse(fresh.textContent).groups;
            if (!state.groups.some(function (g) { return g.id === currentGroupId; })) { currentGroupId = state.groups.length ? state.groups[0].id : null; }
            renderGroups();
            loadPhrases();
        });
    }

    function renderGroups() {
        var html = state.groups.map(function (g) {
            return '<div class="cabinet-wsk-group' + (g.id === currentGroupId ? ' is-active' : '') + '" data-group-id="' + g.id + '">' +
                '<button type="button" class="cabinet-wsk-group__name" data-wsk-group-open>' + esc(g.name) + '</button>' +
                '<span class="cabinet-wsk-group__count">' + fmt(g.count) + '</span>' +
                '<button type="button" class="btn btn-link btn-sm p-0" data-wsk-group-rename aria-label="Переименовать"><i class="bi bi-pencil"></i></button>' +
                '<button type="button" class="btn btn-link btn-sm p-0 text-danger" data-wsk-group-delete aria-label="Удалить"><i class="bi bi-trash"></i></button>' +
                '</div>';
        }).join('');
        $('[data-wsk-groups]').html(html || '<div class="text-muted small">Групп пока нет</div>');
        var $bg = $('[data-wsk-bulk-group]').empty();
        state.groups.forEach(function (g) { $bg.append(new Option(g.name, g.id)); });
    }

    $(document).on('click', '[data-wsk-group-open]', function () {
        currentGroupId = parseInt($(this).closest('[data-group-id]').data('group-id'), 10);
        renderGroups();
        loadPhrases();
    });

    $(document).on('click', '[data-wsk-group-rename]', function () {
        var id = $(this).closest('[data-group-id]').data('group-id');
        var g = state.groups.filter(function (x) { return x.id === id; })[0];
        var name = window.prompt('Название группы', g.name);
        if (!name || name === g.name) { return; }
        request(ds.groupsUrl + '/' + id, 'POST', { name: name }).then(function (j) { g.name = j.group.name; renderGroups(); })
            .catch(function (e) { toast(e.message, false); });
    });

    $(document).on('click', '[data-wsk-group-delete]', function () {
        var id = $(this).closest('[data-group-id]').data('group-id');
        if (!window.confirm('Удалить группу вместе с фразами?')) { return; }
        request(ds.groupsUrl + '/' + id + '/delete', 'POST').then(function (j) { toast(j.message); reloadGroups(); })
            .catch(function (e) { toast(e.message, false); });
    });

    /* ---------- phrases table ---------- */
    function loadPhrases() {
        if (!currentGroupId) { phrases = []; renderRows(); return; }
        request(ds.phrasesUrl + '?group_id=' + currentGroupId).then(function (j) { phrases = j.phrases; renderRows(); });
    }

    function renderRows() {
        var q = String($('[data-wsk-search]').val() || '').toLowerCase().trim();
        var rows = phrases.filter(function (p) { return !q || p.phrase.toLowerCase().indexOf(q) !== -1; });
        rows.sort(function (a, b) {
            var x = a[sort.key], y = b[sort.key];
            if (sort.key === 'phrase') { return sort.dir * String(x).localeCompare(String(y), 'ru'); }
            return sort.dir * ((x || 0) - (y || 0));
        });
        $('[data-wsk-rows]').html(rows.slice(0, 5000).map(function (p) {
            return '<tr><td class="cabinet-wsk-check"><input type="checkbox" class="form-check-input" data-wsk-check value="' + p.id + '"></td>' +
                '<td>' + esc(p.phrase) + '</td><td class="text-end">' + fmt(p.freq) + '</td><td class="text-muted small">' + (SOURCES[p.source] || p.source) + '</td></tr>';
        }).join(''));
    }

    $(document).on('input', '[data-wsk-search]', renderRows);
    $(document).on('click', '[data-wsk-sort]', function () {
        var key = $(this).data('wsk-sort');
        sort = { key: key, dir: sort.key === key ? -sort.dir : (key === 'phrase' ? 1 : -1) };
        renderRows();
    });
    $(document).on('change', '[data-wsk-check-all]', function () { $('[data-wsk-check]').prop('checked', this.checked); });
    $(document).on('change', '[data-wsk-bulk-action]', function () { $('[data-wsk-bulk-group]').prop('hidden', this.value !== 'move'); });

    $(document).on('click', '[data-wsk-bulk-apply]', function () {
        var action = $('[data-wsk-bulk-action]').val();
        var ids = $('[data-wsk-check]:checked').map(function () { return parseInt(this.value, 10); }).get();
        if (!action || !ids.length) { return; }
        if (action === 'delete' && !window.confirm('Удалить выбранные фразы?')) { return; }
        request(ds.bulkUrl, 'POST', { ids: ids, action: action, group_id: parseInt($('[data-wsk-bulk-group]').val(), 10) || null })
            .then(function (j) { toast('Готово: ' + fmt(j.affected)); reloadGroups(); })
            .catch(function (e) { toast(e.message, false); });
    });

    /* ---------- init ---------- */
    $('[data-wsk-region-select]').each(function () { regionSelect($(this)); });
    $('[data-wsk-preset]').select2({ theme: 'bootstrap4', width: '100%', placeholder: 'Без пресета', allowClear: true });
    if (ds.previewUrl) {
        applySettings(state.defaults);
        renderPresets(null);
        renderGroups();
        loadPhrases();
        if (state.activeRun) { showRun(state.activeRun); }
    }
    $(document).on('cabinet:ajax-form:success', function (e, detail) {
        if (detail && detail.redirect) { window.location.href = detail.redirect; }
    });
})(jQuery);
```

Перед реализацией проверить в `public/js/cabinet-ajax-form.js` точные имена: `window.CabinetAjaxForm.toast(message, ok)` и формат события `cabinet:ajax-form:success` (передаёт ли ответ JSON вторым аргументом; редирект по полю `redirect` helper уже делает сам — тогда последний обработчик удалить). Заменить `window.prompt`/`window.confirm` на модалку подтверждения `data-cabinet-confirm`, если она подключается на странице без доработок (см. `seo-checklist-template-edit.blade.php`); иначе оставить нативные в v1.0 и записать в changelog как долг.

- [ ] **Step 4: CSS `public/css/cabinet-wordstat-keywords.css`**

```css
.cabinet-wsk-page .cabinet-wsk-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.cabinet-wsk-page .cabinet-wsk-empty { padding: 32px; text-align: center; color: #6b7280; border: 1px dashed #d1d5db; border-radius: 8px; }
.cabinet-wsk-page .cabinet-wsk-body { display: grid; grid-template-columns: 280px 1fr; gap: 16px; }
.cabinet-wsk-page .cabinet-wsk-groups { border-right: 1px solid #e5e7eb; padding-right: 12px; max-height: 70vh; overflow: auto; }
.cabinet-wsk-page .cabinet-wsk-group { display: flex; align-items: center; gap: 6px; padding: 4px 6px; border-radius: 6px; }
.cabinet-wsk-page .cabinet-wsk-group.is-active { background: #eef2ff; }
.cabinet-wsk-page .cabinet-wsk-group__name { flex: 1; text-align: left; background: none; border: 0; padding: 0; color: inherit; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cabinet-wsk-page .cabinet-wsk-group__count { color: #6b7280; font-size: 12px; font-variant-numeric: tabular-nums; }
.cabinet-wsk-page .cabinet-wsk-table__scroll { max-height: 70vh; overflow: auto; }
.cabinet-wsk-page .cabinet-wsk-table__scroll thead th { position: sticky; top: 0; background: #fff; cursor: pointer; }
.cabinet-wsk-page .cabinet-wsk-check { width: 32px; }
.cabinet-wsk-page .cabinet-wsk-preview { padding: 8px 12px; background: #f9fafb; border-radius: 6px; }
@media (max-width: 991px) { .cabinet-wsk-page .cabinet-wsk-body { grid-template-columns: 1fr; } .cabinet-wsk-page .cabinet-wsk-groups { border-right: 0; } }
```

- [ ] **Step 5: Smoke**

`scripts/smoke-wordstat-keywords.php` — по образцу `scripts/smoke-php85-modules.php`: логин пользователем `$argv[1]` (по умолчанию 4), `GET /wordstat-keywords` и `GET /wordstat-keywords/{id}` (id первого доступного проекта, если есть) через `$kernel->handle(Request::create(...))`, печать кода ответа; проверка, что в HTML нет `dataTables`, `jqcloud`, ` title="` внутри `.cabinet-wsk-page`, и есть `cabinetWskData`.

Run: `/opt/homebrew/opt/php@8.5/bin/php scripts/smoke-wordstat-keywords.php`
Expected: обе страницы `200`, проверки `ok`.

Ручная проверка на `http://localhost:3002/wordstat-keywords`: создать проект → вставить `Окна: пластиковые окна` и `# Потолки` / `натяжные потолки` → «Проверить» (2 группы, 2 фразы, ~2 запроса) → «Собрать» → прогресс до «Готово» (локально нужен воркер: `/opt/homebrew/opt/php@8.5/bin/php artisan queue:work database --queue=wordstat --once` дважды-трижды) → фразы в группах, сортировка, поиск, перенос, минус, переименование, XLSX открывается.

- [ ] **Step 6: Коммит**

```bash
git add resources/views/wordstat-keywords public/js/cabinet-wordstat-keywords.js public/css/cabinet-wordstat-keywords.css scripts/smoke-wordstat-keywords.php
git commit -m "feat(wordstat): project list and project page UI"
```

---

### Task 10: Воркеры, деплой, документация

**Files:**
- Modify: `deploy/supervisor/cabinet-titlo.conf.example`
- Modify: `scripts/deploy-titlo.sh` (список групп, ~строки 41–55)
- Modify: `titlo.ru/docs/cabinet-wordstat-keywords-changelog.md`, `titlo.ru/docs/cabinet-titlo-deploy.md`
- Modify: `config/cabinet-xml-providers.php` (модуль в списке `modules`)

- [ ] **Step 1: Supervisor**

В `deploy/supervisor/cabinet-titlo.conf.example` после блока `cabinet-titlo-site-audit-aggregate`:

```ini
[program:cabinet-titlo-wordstat]
process_name=%(program_name)s_%(process_num)02d
command=/opt/php85/bin/php /var/www/cabinet_titl_usr/data/www/cabinet.titlo.ru/artisan queue:work database --queue=wordstat --sleep=3 --tries=5 --timeout=180 --max-time=3600
directory=/var/www/cabinet_titl_usr/data/www/cabinet.titlo.ru
user=cabinet_titl_usr
numprocs=2
autostart=true
autorestart=true
stopwaitsecs=200
stdout_logfile=/var/www/cabinet_titl_usr/data/www/cabinet.titlo.ru/storage/logs/supervisor-wordstat.log
stderr_logfile=/var/www/cabinet_titl_usr/data/www/cabinet.titlo.ru/storage/logs/supervisor-wordstat.log
stdout_logfile_maxbytes=20MB
stderr_logfile_maxbytes=20MB
```

В `scripts/deploy-titlo.sh` добавить `cabinet-titlo-wordstat` в список групп после `cabinet-titlo-site-audit-aggregate`.

- [ ] **Step 2: Реестр провайдеров**

В `config/cabinet-xml-providers.php`, массив `modules`, добавить:

```php
        [
            'key' => 'wordstat-keywords',
            'title' => 'Подбор слов Wordstat',
            'route' => 'pages.wordstat-keywords',
            'class' => 'App\\Services\\Wordstat\\WordstatClient',
            'facade' => 'WordstatClient',
            'providers' => ['xmlstock'],
            'engines' => ['yandex'],
            'usage' => 'Wordstat API: wordstat/json, pagetype=words (левая и правая колонки)',
        ],
```

- [ ] **Step 3: Документация**

Changelog `1.0.0`: перечислить возможности этапа 1. В `cabinet-titlo-deploy.md` в список supervisor-групп добавить `cabinet-titlo-wordstat` и шаг для первого выката: скопировать блок в `/etc/supervisor/conf.d/cabinet-titlo.conf`, `supervisorctl reread && supervisorctl update`.

- [ ] **Step 4: Полный прогон тестов модуля**

Run: `/opt/homebrew/opt/php@7.4/bin/php vendor/bin/phpunit tests/Unit/Wordstat && /opt/homebrew/opt/php@7.4/bin/php vendor/bin/phpunit tests/Feature/Wordstat`
Expected: оба `OK`.

Run: `/opt/homebrew/opt/php@8.5/bin/php artisan view:cache && for f in storage/framework/views/*.php; do /opt/homebrew/opt/php@8.5/bin/php -l "$f" >/dev/null || echo "BAD $f"; done`
Expected: нет строк `BAD`.

- [ ] **Step 5: Коммиты**

```bash
git add deploy/supervisor/cabinet-titlo.conf.example scripts/deploy-titlo.sh config/cabinet-xml-providers.php
git commit -m "chore(wordstat): supervisor group and provider registry"
```

В репозитории `titlo.ru`:

```bash
git add docs/cabinet-wordstat-keywords-changelog.md docs/cabinet-titlo-deploy.md
git commit -m "docs(wordstat): changelog 1.0.0 and deploy notes"
```

Выкат на prod — только по команде пользователя: `./scripts/deploy-titlo.sh`, затем на сервере добавить блок supervisor, `supervisorctl reread && supervisorctl update`, `artisan migrate --force`, smoke одной затравкой.
