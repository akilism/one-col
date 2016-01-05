import {
  default as React,
} from "react";

import {
  WebpackScriptEntry,
  WebpackStyleEntry,
} from "reacthtmlpack/lib/entry";

const googleMapsScript = process.env.GOOGLE_MAPS_KEY
  ? `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places,visualization&key=${process.env.GOOGLE_MAPS_KEY}`
  : 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places,visualization'

export default (
  <html>
    <head>
      <title>Two Col Ideas</title>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <meta charSet="UTF-8" />
      <link rel="icon" href="http://www.vice.com/assets/images/vice/favicons/mstile-310x310.png"/>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css" />
      <WebpackStyleEntry
        chunkName="client"
        chunkFilepath="../scripts/client.js"
        configFilepath="../Client.webpackConfig.js"
      />

    </head>
    <body>
      <div id="reactContainer" />
      <script type="text/javascript" src={googleMapsScript} />
      <WebpackScriptEntry
        chunkName="client"
        chunkFilepath="../scripts/client.js"
        configFilepath="../Client.webpackConfig.js"
      />
    </body>
  </html>
);
