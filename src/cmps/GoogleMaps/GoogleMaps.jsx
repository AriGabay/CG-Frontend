import React from 'react';
import GoogleMapReact from 'google-map-react';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';

const GoogleMaps = ({
  latitude = 32.7800841914527,
  longitude = 35.49911543311995,
}) => {
  const matches = useMediaQuery('(min-width:700px)');
  const renderMarkers = (map, maps) => {
    let marker = new maps.Marker({
      position: { lat: latitude, lng: longitude },
      map,
      title: 'קייטרינג גבאי רחוב המברג 10 טבריה',
      label: 'קייטרינג גבאי',
    });
    return marker;
  };

  return (
    <Grid
      style={{
        height: matches ? '50vh' : '40vh',
        width: matches ? '50%' : '90%',
      }}
    >
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_KEY }}
        defaultCenter={{ lat: latitude, lng: longitude }}
        defaultZoom={16}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => renderMarkers(map, maps)}
      ></GoogleMapReact>
    </Grid>
  );
};

export default GoogleMaps;
