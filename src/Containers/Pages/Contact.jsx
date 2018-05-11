// @flow
import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { CenterContainer } from '../../Components/Styled';
import { GOOGLE_API_KEY } from '../../Constants';

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
  document.title = 'UDIA';
  return (
    <CenterContainer>
      <h1>Contact</h1>
      <UdiaMapComponent
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
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
      <p>
        <a href="mailto:alex@udia.ca">alex@udia.ca</a>
      </p>
    </CenterContainer>
  );
};

export default Contact;
