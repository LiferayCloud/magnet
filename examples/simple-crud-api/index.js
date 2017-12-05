export const route = {
  method: 'get',
  path: '/',
  type: 'html',
};

export default () => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Magnet</title>
</head>
<body>
  <h1>It works!</h1>
  <a href="/api">http://localhost:3000/api</a>
</body>
</html>`;
