# Верстка проекта Carbogatto
[Открыть проект](http://irbisc.tmweb.ru/cb2/all.html)

Используется html-шаблонизатор [pug](https://pugjs.org/) система сборки [webpack](https://webpack.js.org/)
и система управления задачами [gulp](https://gulpjs.com/)

После клонирования репо нужно установить зависимости:
npm install

Для сборки html, напрмиер страницы about:
./node_modules/.bin/pug -w templates/about.pug

Для dev-сборки стилей:
./node_modules/.bin/gulp dev

Для dev-сборки js:
./node_modules/.bin/webpack-dev-server --mode=development

---
Для production-сборки стилей:
NODE_ENV=production ./node_modules/.bin/gulp build

Для production-сборки js:
NODE_ENV=production ./node_modules/.bin/webpack --mode=production

Если собирать самому не хочется, то в папке build уже лежат собранные стили и скрипты
Портировать html-верстку в реальный проект рекомендуется из исходников верстки - *.pug файлов 