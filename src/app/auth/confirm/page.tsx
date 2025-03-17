export default function Page({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  return (
    <div>
      <div className="w-full px-8 sm:max-w-lg mx-auto mt-8">
        <p className="text-foreground">
          Check email{" "}
          <a href={`mailto:${searchParams.message}`}
            className="text-blue-500 underline">  {searchParams.message}    
          </a>
            
            {" "}
          to continue the sign-in process.
        </p>
      </div>
    </div>
  );
}
