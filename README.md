# docsify-dynamo
docsify plugin for creating dynamic documentation sites

## General
Dynamo is a plugin for Docsify ([link](https://docsify.js.org/)) that allows you to dynamically generate content in your markdown pages, using the powerful [ejs](https://ejs.co/) templating engine.

Using dynamo you can incorporate dynamic content, or even generate pages dynamically for your documentation site. For example:

```markdown
# README

<%# simple inline calculation %>
Addition is simple! 1 + 1 = <%= 1 + 1 %>

<%# iteration %>
Here is a list:
<% ['milk', 'eggs', 'jam'].forEach((item) => {>
* <%= item %>
<% }>

<%# and even async data fetching! %>
<%
  const response = await fetch('https://catfact.ninja/fact').then(res => res.json())
%>
Cat fact of the day:
> <%= response.fact>
```

Will generate the following markdown:
```markdown
# README

Addition is simple! 1 + 1 = 2

Here is a list:
* milk
* eggs
* jam

Cat fact of the day:
> On average, a cat will sleep for 16 hours a day.
```

## Install
### UMD
The most simple way is to use Dynamo's UMD bundle:
```html
<script src="https://unpkg.com/docsify-dynamo/umd/dynamo.min.js"></script>
```

And then just use the plugin that was created on the window with docsify:
```js
window.$docsify = {
  plugins: [DocsifyDynamo()]
}
```

### NPM
Alternatively, install using NPM:
```sh
npm install docsify-dynamo
```

Then import and use it with docsify:
```js
import { docsifyDynamo } from 'docsify-dynamo';

window.$docsify = {
  plugins: [docsifyDynamo()]
}
```

You are now ready to go!

## Usage
### Dynamic Content
In order to support dynamo in your page, simply add an `ejs` suffix to it, that is: `README.md.ejs`.

Then, if you want to link to it, simply ignore the `.ejs` part, that is:

```markdown
# Table of Contents
- [Home](README.md) <-- no ejs
```

### Render Props
Every rendered page gets some params from dynamo. These are called "Render Props". Dynamo injects the following render props to the page:
1. `path` - the full path of the page, without extension (e.g. /pages/MY_PAGE)
2. `basename` - the final part of the path (e.g. MY_PAGE)
3. `query` - a string to string object that contains query parameters passed in the url (e.g. `{ name: 'roy' }`)

You can access those from your ejs:
```markdown
# Render Props
These are the render props:
1. path: <%= path %>
2. basename: <%= basename %>
3. query: <%= query %>
```

### Dynamic Routes
If you want to create documentation pages for a dynamic collection, instead of creating several pages, you can create a single page and name it: `[...].md.ejs`. That way, you create the page once but it will be replicated for any item you wish to access.

For example, if you have a collection of pets, you can create the following directory and file: `/pets/[...].md.ejs`. Now, if you have the following link in your homepage:

```markdown
# Table of Contents
- [Dogs](/pets/DOGS.md)
- [Cats](/pets/CATS.md)
```

Every one of them will use the same template file under `/pets/`, but will render it with different render props.

### Caching
By default, dynamo only renders every page once and caches it. If you want to give up this behavior, simply configure dynamo to turn cache off:
```js
window.$docsify = {
  plugins: [DocsifyDynamo({ cache: false })]
}
```
