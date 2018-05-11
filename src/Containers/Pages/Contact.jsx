// @flow
import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { CenterContainer, Textarea } from '../../Components/Styled';
import { GOOGLE_API_KEY } from '../../Constants';

const ALEX_GPG_PUBLIC_KEY = `-----BEGIN PGP PUBLIC KEY BLOCK-----

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
=qgfh
-----END PGP PUBLIC KEY BLOCK-----
`;

const fancyMap = [
  { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#ffffff' }] },
  {
    featureType: 'all',
    elementType: 'labels.text.stroke',
    stylers: [{ visibility: 'on' }, { color: '#3e606f' }, { weight: 2 }, { gamma: 0.84 }],
  },
  { featureType: 'all', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{ weight: 0.6 }, { color: '#d2e871' }],
  },
  {
    featureType: 'administrative',
    elementType: 'labels.text',
    stylers: [{ visibility: 'on' }, { color: '#ffffef' }, { weight: '1.0' }],
  },
  {
    featureType: 'administrative',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#112f50' }],
  },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#112f50' }] },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#112f50' }, { lightness: '5' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#112f50' }, { lightness: '19' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      { color: '#112f50' },
      { lightness: '19' },
      { gamma: '1.00' },
      { weight: '1' },
      { saturation: '-43' },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#406d80' }, { visibility: 'off' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#112f50' }, { saturation: '0' }, { lightness: '-25' }, { gamma: '1' }],
  },
];

const UdiaMapComponent = withScriptjs(withGoogleMap(() => (
  <GoogleMap
    defaultZoom={14}
    defaultCenter={{ lat: 53.5458809, lng: -113.4990532 }}
    options={{ scrollwheel: false, styles: fancyMap }}
  >
    <Marker position={{ lat: 53.5458809, lng: -113.4990532 }} />
  </GoogleMap>
)));

const Contact = () => {
  document.title = 'Contact - UDIA';
  return (
    <CenterContainer>
      <h1>Contact</h1>
      <UdiaMapComponent
        googleMapURL={
          `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}` +
          '&v=3.exp&libraries=geometry,drawing,places'
        }
        loadingElement={<div style={{ height: '400px' }} />}
        containerElement={<div style={{ height: '400px', width: '96vw' }} />}
        mapElement={<div style={{ height: '400px' }} />}
      />
      <p>
        <a href="https://goo.gl/maps/sXheMfn7PRE2">
          Startup Edmonton<br />
          Unit 301 - 10359 104 Street NW<br />
          Edmonton, AB T5J 1B9<br />
          Canada
        </a>
      </p>
      <Textarea
        defaultValue={ALEX_GPG_PUBLIC_KEY}
        readonly
        disabled
        rows={22}
        style={{ minWidth: '300px', maxWidth: '96vw', minHeight: '100px' }}
      />
      <p>
        <a href="mailto:alex@udia.ca">alex@udia.ca</a>
      </p>
    </CenterContainer>
  );
};

export default Contact;
