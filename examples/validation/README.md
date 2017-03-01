## Setup

1. Make sure you have [node and npm](https://nodejs.org/en/download/) installed:

  ```sh
node -v && npm -v
  ```

2. Install dependencies:

  ```sh
npm install
  ```

## Usage

* Serve it locally, and watch for any changes:

  ```
npm run dev
  ```

Your app will be up and running:

```bash
~/P/w/m/e/validation ❯❯❯ npm run dev                                                                                                           ⏎ master ✭ ✚ ◼

> validation@ dev /Users/eduardo/Projects/wedeploy/magnet/examples/validation
> magnet

> info Building assets…
>
>  ┌────────┬──────┬──────┬─────────┐
>  │ method │ path │ type │ file    │
>  ├────────┼──────┼──────┼─────────┤
>  │ GET    │ /api │ json │ /api.js │
>  └────────┴──────┴──────┴─────────┘
>
> info Ready on http://0.0.0.0:3000
```

Now check if routes were registered:

```bash
~/P/w/magnet❯❯❯ curl http://localhost:3001/api
```

Results in `400` response due to [parameters validation](https://github.com/wedeploy/magnet/blob/master/examples/validation/api.js#L8-L9)

```json
{
  "status": 400,
  "message": "Bad Request",
  "errors": [
    {
      "reason": "parameter_required",
      "context": {
        "param": "name"
      }
    },
    {
      "reason": "parameter_must_be_alphanumeric",
      "context": {
        "param": "name"
      }
    }
  ]
}
```

Request it again with the required parameters:

```bash
~/P/w/magnet❯❯❯ curl http://localhost:3001/api?name=Effy
```

Results in

```json
{
  "hello": "Effy"
}
```

Enjoy!

## License

[BSD License](https://github.com/wedeploy/magnet/blob/master/LICENSE.md) © Liferay, Inc.
