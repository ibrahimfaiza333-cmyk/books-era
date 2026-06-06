export const dynamic = "force-dynamic";
import type { Metadata, ResolvingMetadata } from "next";
import { MainLayoutClient, BookDetailClient } from "@/app/PageLoaders";

type Props = {
  params: Promise<{ id: string }>
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  try {
    const res = await fetch(`${baseUrl}/books/${id}`, { cache: 'no-store' });
    const json = await res.json();
    const book = json?.data;

    if (!book) {
      return {
        title: "Book Not Found | Suleman Books",
      };
    }

    const title = `${book.title} by ${book.author} | Suleman Books`;
    const description = book.description?.slice(0, 160) || `Buy ${book.title} online in Pakistan at Suleman Books.`;
    const imageUrl = book.coverImage || book.thumbnail || (book.images && book.images[0]?.url) || "/images/og-image.jpg";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "book",
        url: `https://sulemanbooks.com/books/${id}`,
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 1200,
            alt: book.title,
          }
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch (error) {
    return {
      title: "Book Details | Suleman Books",
      description: "View detailed information about this book.",
    };
  }
}

export default function Page({ params }: Props) {
  return (
    <MainLayoutClient>
      <BookDetailClient />
    </MainLayoutClient>
  );
}
