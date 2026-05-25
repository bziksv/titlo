/** Встроенные пресеты — те же шаблоны, что в кабинете (`config/html-editor-builtin-presets.php`). */
export type HtmlEditorBuiltinPreset = {
  id: string;
  name: string;
  html: string;
};

export const HTML_EDITOR_BUILTIN_PRESETS: HtmlEditorBuiltinPreset[] = [
  {
    id: "landing-block",
    name: "Блок посадочной",
    html: `<h2>Заголовок блока</h2>
<p>Краткий текст посадочной: <strong>преимущества</strong>, условия и призыв к действию.</p>
<ul>
    <li>Первое преимущество</li>
    <li>Второе преимущество</li>
    <li>Третье преимущество</li>
</ul>
<p><a href="#">Узнать подробнее</a></p>`,
  },
  {
    id: "table-5x5",
    name: "Таблица 5×5",
    html: `<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
    <thead>
        <tr>
            <th>Столбец 1</th>
            <th>Столбец 2</th>
            <th>Столбец 3</th>
            <th>Столбец 4</th>
            <th>Столбец 5</th>
        </tr>
    </thead>
    <tbody>
        <tr><td>Ячейка 1</td><td>Ячейка 2</td><td>Ячейка 3</td><td>Ячейка 4</td><td>Ячейка 5</td></tr>
        <tr><td>Ячейка 1</td><td>Ячейка 2</td><td>Ячейка 3</td><td>Ячейка 4</td><td>Ячейка 5</td></tr>
        <tr><td>Ячейка 1</td><td>Ячейка 2</td><td>Ячейка 3</td><td>Ячейка 4</td><td>Ячейка 5</td></tr>
        <tr><td>Ячейка 1</td><td>Ячейка 2</td><td>Ячейка 3</td><td>Ячейка 4</td><td>Ячейка 5</td></tr>
        <tr><td>Ячейка 1</td><td>Ячейка 2</td><td>Ячейка 3</td><td>Ячейка 4</td><td>Ячейка 5</td></tr>
    </tbody>
</table>`,
  },
  {
    id: "faq",
    name: "Блок FAQ",
    html: `<h2>Частые вопросы</h2>
<h3>Вопрос 1?</h3>
<p>Ответ на первый вопрос.</p>
<h3>Вопрос 2?</h3>
<p>Ответ на второй вопрос.</p>
<h3>Вопрос 3?</h3>
<p>Ответ на третий вопрос.</p>`,
  },
  {
    id: "cta",
    name: "Блок с кнопкой (CTA)",
    html: `<div style="padding: 24px; text-align: center; background: #f5f5f5; border-radius: 8px;">
    <h2>Готовы начать?</h2>
    <p>Оставьте заявку — перезвоним в течение часа.</p>
    <p><a href="#" style="display: inline-block; padding: 12px 24px; background: #0d6efd; color: #fff; text-decoration: none; border-radius: 6px;">Оставить заявку</a></p>
</div>`,
  },
  {
    id: "article",
    name: "Статья с заголовками",
    html: `<h1>Заголовок статьи</h1>
<p>Вступительный абзац с основной мыслью материала.</p>
<h2>Раздел 1</h2>
<p>Текст первого раздела.</p>
<h2>Раздел 2</h2>
<p>Текст второго раздела.</p>
<h3>Подраздел</h3>
<p>Детали подраздела.</p>`,
  },
];

export const HTML_EDITOR_DEMO_START_HTML = HTML_EDITOR_BUILTIN_PRESETS[0]?.html ?? "";
