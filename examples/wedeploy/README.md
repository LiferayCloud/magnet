# wedeploy-example

Learn how to deploy a private api to WeDeploy in minutes using [wedeploy-middleware](http://github.com/wedeploy/wedeploy-middleware) and [Magnet](http://github.com/wedeploy/magnet). APIs created with Magnet can run locally or in the cloud. This example intends to show Magnet integrated with a cloud provider.

## Setup

1. Install [WeDeploy Command-line](http://wedeploy.com/docs/intro/using-the-command-line.html).

# Deploy

```sh
cd magnet/examples/wedeploy/
we deploy -p myproject
```

That's all! now you have your api deployed in the cloud.

## Have fun

The following example uses `curl` to request the private api exposed by [Magnet](http://github.com/wedeploy/magnet).

1. Create an user to test requests to the private path:

```sh
curl -XPOST auth.myproject.wedeploy.io/users -d '{"email":"user@email.com", "password":"pass"}' -H 'Content-Type: application/json'
```

Results in

```json
{"createdAt":1487978417414,"password":"...","id":"208617167906807212","email":"user@email.com"}
```

2. Request the private path passing the user credentials:

```sh
curl -X GET api.myproject.wedeploy.io/private/api -u user@email.com:pass -v
```

Results in

```json
{"hello":"this is a private api"}
```
