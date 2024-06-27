import Image from 'next/image';
import { blogsData } from '../../../data';

import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '../ui/carousel';

export function FeaturedBlogs() {
  return (
    <section className='px-6 pb-28 bg-secondary max-w-screen-xl lg:mx-auto'>
      <h2 className='text-2xl font-bold mb-12'>Featured Blogs</h2>
      <Carousel>
        <CarouselContent>
          {blogsData.map(item => (
            <CarouselItem key={item.id} className='basis-10/12 sm:basis-1/2 lg:basis-1/3'>
              <Card className='grid max-w-lg h-full'>
                <CardHeader>
                  <h3 className='text-lg font-semibold'>{item.title}</h3>
                  <p className='mt-2 text-sm text-gray-500'>{item.description}</p>
                </CardHeader>
                <CardContent className='mt-auto'>
                  <Image
                    src={item.image}
                    alt={item.title}
                    className='rounded-lg'
                    width={500}
                    height={250}
                  />
                </CardContent>
                <CardFooter className='mt-auto'>
                  <Button size='sm' variant='outline'>
                    Read More
                  </Button>
                </CardFooter>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className='absolute top-full translate-y-1/2 left-0' />
        <CarouselNext className='absolute top-full translate-y-1/2 right-0' />
      </Carousel>
    </section>
  );
}
