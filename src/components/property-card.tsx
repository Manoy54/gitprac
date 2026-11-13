import Image from "next/image";
import {
  ArrowUpRight,
  Bath,
  BedDouble,
  Heart,
  MoveUpRight,
  Scan,
} from "lucide-react";
import { money, type Property } from "@/lib/demo-data";

type Props = {
  property: Property;
  onOpen: (property: Property) => void;
  renter?: boolean;
  saved?: boolean;
  onSave?: () => void;
  list?: boolean;
};

export default function PropertyCard({
  property,
  onOpen,
  renter,
  saved,
  onSave,
  list,
}: Props) {
  return (
    <article
      className={`property-card group ${list ? "property-list-item" : ""}`}
    >
      <div className="property-image relative overflow-hidden">
        <button
          onClick={() => onOpen(property)}
          className="block h-full w-full"
          aria-label={`View ${property.name}`}
        >
          <Image
            src={`/images/${property.image}.jpg`}
            alt={`${property.name} rental home`}
            loading={property.id === "FM-001" ? "eager" : "lazy"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1100px) 45vw, 30vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
          />
        </button>
        <span
          className={`property-status micro ${property.status === "Available" ? "available" : ""}`}
        >
          <span className="status-dot" />
          {property.status}
        </span>
        {renter ? (
          <button
            onClick={onSave}
            aria-label={`${saved ? "Unsave" : "Save"} ${property.name}`}
            aria-pressed={saved}
            className={`save-button ${saved ? "is-saved" : ""}`}
          >
            <Heart size={17} fill={saved ? "currentColor" : "none"} />
          </button>
        ) : (
          <span className="image-index micro">{property.id}</span>
        )}
      </div>
      <div className="property-copy">
        <div className="flex items-start justify-between gap-2">
          <button
            className="property-name text-left"
            onClick={() => onOpen(property)}
          >
            {property.name}
          </button>
          <ArrowUpRight size={18} aria-hidden="true" />
        </div>
        <p className="property-location">{property.neighborhood}</p>
        <dl className="property-specs flex items-center gap-4">
          <div>
            <dt className="sr-only">Bedrooms</dt>
            <BedDouble size={15} />
            <dd>{property.beds} beds</dd>
          </div>
          <div>
            <dt className="sr-only">Bathrooms</dt>
            <Bath size={15} />
            <dd>{property.baths} baths</dd>
          </div>
          <div>
            <dt className="sr-only">Area</dt>
            <Scan size={14} />
            <dd>{property.area.toLocaleString()} ft²</dd>
          </div>
        </dl>
        <div className="property-bottom flex items-center justify-between gap-2">
          <p>
            <strong>{money(property.rent)}</strong>
            <span className="rent-period"> / month</span>
          </p>
          <span className="micro">
            {renter
              ? "VIEW HOME"
              : property.tenant
                ? property.tenant
                : "READY TO LEASE"}{" "}
            {renter && <MoveUpRight className="inline" size={12} />}
          </span>
        </div>
      </div>
    </article>
  );
}
