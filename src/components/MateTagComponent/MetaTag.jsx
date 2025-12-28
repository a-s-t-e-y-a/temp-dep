import { Helmet } from "react-helmet-async";

function MetaTag({
    title , description , ogTitle , ogDescription
}) {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta
          name="description"
          content={description}
        />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
      </Helmet>
    </>
  );
}

export default MetaTag;
