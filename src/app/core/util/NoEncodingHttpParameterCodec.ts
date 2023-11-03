import { HttpParameterCodec } from "@angular/common/http";

export class NoEncodingHttpParameterCodec implements HttpParameterCodec {
    encodeKey(key: string): string {
        return encodeURIComponent(key);
    }

    encodeValue(value: string): string {
        return value;
    }

    decodeKey(key: string): string {
        return decodeURIComponent(key);
    }

    decodeValue(value: string): string {
        return value;
    }
}