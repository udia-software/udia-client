import React from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  InfoWindow
} from "react-google-maps";

const UdiaOfficeMap = withScriptjs(
  withGoogleMap(props => {
    const UDIA_LAT = 53.5458809;
    const UDIA_LNG = -113.5012419;
    const MAP_STYLES = [
      {
        featureType: "all",
        elementType: "labels.text.fill",
        stylers: [{ saturation: 36 }, { color: "#000000" }, { lightness: 40 }]
      },
      {
        featureType: "all",
        elementType: "labels.text.stroke",
        stylers: [{ visibility: "on" }, { color: "#000000" }, { lightness: 16 }]
      },
      {
        featureType: "all",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: "administrative",
        elementType: "geometry.fill",
        stylers: [{ color: "#000000" }, { lightness: 20 }]
      },
      {
        featureType: "administrative",
        elementType: "geometry.stroke",
        stylers: [{ color: "#000000" }, { lightness: 17 }, { weight: 1.2 }]
      },
      {
        featureType: "landscape",
        elementType: "geometry",
        stylers: [{ color: "#000000" }, { lightness: 20 }]
      },
      {
        featureType: "poi",
        elementType: "geometry",
        stylers: [{ color: "#000000" }, { lightness: 21 }]
      },
      {
        featureType: "road.highway",
        elementType: "geometry.fill",
        stylers: [{ color: "#000000" }, { lightness: 17 }]
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#000000" }, { lightness: 29 }, { weight: 0.2 }]
      },
      {
        featureType: "road.arterial",
        elementType: "geometry",
        stylers: [{ color: "#000000" }, { lightness: 18 }]
      },
      {
        featureType: "road.local",
        elementType: "geometry",
        stylers: [{ color: "#000000" }, { lightness: 16 }]
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#000000" }, { lightness: 19 }]
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#000000" }, { lightness: 17 }]
      }
    ];
    return (
      <GoogleMap
        defaultZoom={14}
        defaultCenter={{ lat: UDIA_LAT, lng: UDIA_LNG }}
        defaultOptions={{
          scrollwheel: false,
          styles: MAP_STYLES
        }}
      >
        <InfoWindow position={{ lat: UDIA_LAT, lng: UDIA_LNG }}>
          <div>UDIA</div>
        </InfoWindow>
      </GoogleMap>
    );
  })
);

export default UdiaOfficeMap;
