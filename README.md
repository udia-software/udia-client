# Udia Client

Generated using [create-react-app](https://github.com/facebookincubator/create-react-app).

## Quickstart (Development)

* Ensure the server is up and running locally.
  * [udia-server](https://pi.alexander-wong.com/gogs/udia-software/udia-server)
* Install dependencies with `yarn install`
* Run the client with `yarn start`

Now you can visit `localhost:3001` from your browser.

## Environment Variables

The environment variables are embedded during the build time. For more information, please refer to the [docs](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-custom-environment-variables).

| Environment Variable               | Default Value                       | Description                    |
| ---------------------------------- |:-----------------------------------:| ------------------------------:|
| `REACT_APP_GRAPHQL_ENDPOINT`       | `http://localhost:3000/graphql`     | GraphQL API endpoint           |
| `REACT_APP_SUBSCRIPTIONS_ENDPOINT` | `ws://localhost:3000/subscriptions` | GraphQL Subscriptions Endpoint |

## Production

To build the production instance of this application, run the following:

```bash
yarn build

# then, to serve the production site locally
yarn global add serve
serve -s build --port 3001
```

## Testing

To test the react app, call `yarn test`.
