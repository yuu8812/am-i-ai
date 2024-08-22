const DefaultToast = ({
  message,
  twClassName,
  ...props
}: {
  message: string;
  twClassName?: string;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) => {
  return (
    <div className={`w-fit text-sm font-semibold ${twClassName}`} {...props}>
      {message}
    </div>
  );
};

export default DefaultToast;
