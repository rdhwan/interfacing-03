import { Tag, Link } from "@chakra-ui/react";

type TagLinkProps = {
  link: string;
  children: React.ReactNode;
};

const TagLink = ({ link, children }: TagLinkProps) => {
  return (
    <Link href={link} target="_blank">
      <Tag colorScheme={"blue"} rounded={"lg"} textDecor={"underline"}>
        {children}
      </Tag>
    </Link>
  );
};

export default TagLink;
