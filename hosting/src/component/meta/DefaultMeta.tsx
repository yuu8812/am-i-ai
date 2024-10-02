import React from "react";
import { Helmet } from "react-helmet";

const DefaultMeta = ({
  title,
  name,
  content,
}: {
  title: string;
  name: string;
  content: string;
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name={name} content={content} />
    </Helmet>
  );
};

export default DefaultMeta;
