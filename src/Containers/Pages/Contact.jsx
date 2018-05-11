// @flow
import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { CenterContainer, Textarea } from '../../Components/Styled';
import { GOOGLE_API_KEY } from '../../Constants';

const ALEX_GPG_PUBLIC_KEY = `-----BEGIN PGP PUBLIC KEY BLOCK-----

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
7GqkQcTgalAcpeNF+vPGVs9c/PhvG+F7XGc0BNI=
=iKPX
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
