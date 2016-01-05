export const placeFinder = (function() {
  let fetchedPlaces = {};

  return {
    getPlaceInfo: (DOMNode, placeId) => {
      const placesService = new google.maps.places.PlacesService(DOMNode);
      return new Promise((resolve, reject) => {
          if(fetchedPlaces[placeId]) { resolve(fetchedPlaces[placeId]); return; }

          placesService.getDetails({placeId: placeId}, (place, status) => {
            if(status === google.maps.places.PlacesServiceStatus.OK) {
              fetchedPlaces[placeId] = place;
              resolve(place);
            } else { reject(status); }
          });
        });
    }
  };
})();
