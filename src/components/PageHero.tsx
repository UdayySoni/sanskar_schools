import { Link } from "react-router-dom";
import Icon from "./Icon";

export default function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  action?: { label: string; to: string; external?: boolean };
}) {
  const actionClass = "button button-gold mt-7";
  return (
    <section className="page-hero">
      <img src={image} alt={imageAlt} className="page-hero-image" fetchPriority="high" decoding="async" />
      <div className="page-hero-overlay" />
      <div className="container relative z-10 flex min-h-[560px] items-end pb-16 pt-36 lg:min-h-[620px] lg:pb-20">
        <div className="max-w-3xl">
          <p className="eyebrow eyebrow-light">{eyebrow}</p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.02] text-white sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80 sm:text-xl">
            {description}
          </p>
          {action && (action.external ? (
            <a href={action.to} target="_blank" rel="noreferrer" className={actionClass}>
              {action.label}<Icon name="external" size={17} />
            </a>
          ) : (
            <Link to={action.to} className={actionClass}>
              {action.label}<Icon name="arrow" size={18} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
