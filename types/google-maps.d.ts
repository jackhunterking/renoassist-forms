// Type definitions for Google Maps JavaScript API
// Specifically for Places Autocomplete functionality

declare namespace google.maps {
  class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
  }

  class LatLngBounds {
    constructor(sw?: LatLng, ne?: LatLng);
    contains(latLng: LatLng): boolean;
    extend(latLng: LatLng): LatLngBounds;
  }

  namespace places {
    class Autocomplete {
      constructor(
        inputElement: HTMLInputElement,
        options?: AutocompleteOptions
      );
      addListener(eventName: string, handler: () => void): void;
      getPlace(): PlaceResult;
      setBounds(bounds: LatLngBounds): void;
      setComponentRestrictions(restrictions: ComponentRestrictions): void;
      setFields(fields: string[]): void;
      setOptions(options: AutocompleteOptions): void;
      setTypes(types: string[]): void;
    }

    interface AutocompleteOptions {
      bounds?: LatLngBounds;
      componentRestrictions?: ComponentRestrictions;
      fields?: string[];
      placeIdOnly?: boolean;
      strictBounds?: boolean;
      types?: string[];
    }

    interface ComponentRestrictions {
      country: string | string[];
    }

    interface PlaceResult {
      address_components?: AddressComponent[];
      formatted_address?: string;
      geometry?: PlaceGeometry;
      name?: string;
      place_id?: string;
      types?: string[];
    }

    interface AddressComponent {
      long_name: string;
      short_name: string;
      types: string[];
    }

    interface PlaceGeometry {
      location?: LatLng;
      viewport?: LatLngBounds;
    }
  }
}

// Make google available globally
declare var google: typeof google;
