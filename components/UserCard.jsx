import Link from "next/link";

export default function UserCard({ name, address, collections, profilePhoto }) {
  const link = `/user/${address}`;
  return (
    <article>
      <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2.5xl block border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg">
        <figure className="relative">
          <Link href={link}>
            <a>
              <img
                src={profilePhoto}
                alt="item 5"
                className="w-full h-[230px] rounded-[0.625rem] object-cover"
              />
            </a>
          </Link>
        </figure>
        <div className="mt-7 flex items-center justify-between">
          <Link href={link}>
            <a>
              <span className="font-display text-jacarta-700 hover:text-accent text-base dark:text-white">
                {name.length > 10 ? name.substr(0, 9) + ".." : name}
              </span>
            </a>
          </Link>
          <span>
            {collections.length} collection
            {collections.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>
    </article>
  );
}
