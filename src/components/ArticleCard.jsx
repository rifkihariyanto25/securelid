import Image from 'next/image';
import Link from 'next/link';

const ArticleCard = ({ id, title, excerpt, date, author, imageSrc }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <Link href={`/artikelpage/${id}`}>
        <div className="relative h-48 w-full">
          <Image 
            src={imageSrc} 
            alt={title} 
            fill 
            className="object-cover"
          />
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/artikelpage/${id}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2">{title}</h3>
        </Link>
        <p className="text-sm text-gray-600 mb-3">{excerpt}</p>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Oleh: {author}</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;