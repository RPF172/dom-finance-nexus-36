import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Clock, ArrowRight } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  objective?: string;
  slug?: string;
  featured_image_url?: string;
  type: 'lesson' | 'chapter';
  estimated_time?: number;
}

interface ContentCarouselProps {
  className?: string;
}

export function ContentCarousel({ className = '' }: ContentCarouselProps) {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [storageImages, setStorageImages] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Fetch lessons
        const { data: lessons } = await supabase
          .from('lessons')
          .select('id, title, objective, slug, featured_image_url, estimated_time')
          .eq('published', true)
          .limit(6);

        // Fetch chapters
        const { data: chapters } = await supabase
          .from('chapters')
          .select('id, title, featured_image_url')
          .eq('published', true)
          .limit(4);

        // Fetch storage images
        const { data: storageFiles } = await supabase.storage
          .from('magat')
          .list('', { limit: 10 });

        if (storageFiles) {
          const imageUrls = storageFiles
            .filter(file => file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i))
            .map(file => `https://ybefnvazeniezrwzpvtf.supabase.co/storage/v1/object/public/magat/${file.name}`);
          setStorageImages(imageUrls);
        }

        // Combine and shuffle content
        const allContent: ContentItem[] = [
          ...(lessons || []).map(lesson => ({ ...lesson, type: 'lesson' as const })),
          ...(chapters || []).map(chapter => ({ ...chapter, type: 'chapter' as const }))
        ];

        // Shuffle array
        const shuffled = allContent.sort(() => Math.random() - 0.5);
        setContent(shuffled.slice(0, 8));
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    fetchContent();
  }, []);

  const handleContentClick = (item: ContentItem) => {
    if (item.type === 'lesson') {
      navigate(`/lessons/${item.slug}`);
    } else {
      navigate(`/chapters/${item.id}`);
    }
  };

  const getRandomImage = () => {
    if (storageImages.length === 0) return '/placeholder.svg';
    return storageImages[Math.floor(Math.random() * storageImages.length)];
  };

  return (
    <section className={`w-full py-12 sm:py-16 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-institutional text-command-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase mb-4">
            Explore Our Content
          </h2>
          <p className="text-lg text-gray-600 font-inter max-w-2xl mx-auto">
            Discover lessons and chapters designed to break you down and build you up in our image.
          </p>
        </div>

        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {content.map((item, index) => (
                <CarouselItem key={`${item.type}-${item.id}`} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <Card 
                    className="group cursor-pointer border border-gray-200 hover:border-command-black hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-obedience-white"
                    onClick={() => handleContentClick(item)}
                  >
                    <div className="relative overflow-hidden">
                      <OptimizedImage
                        src={item.featured_image_url || getRandomImage()}
                        alt={item.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        aspectRatio="auto"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge 
                          variant="secondary" 
                          className="bg-command-black/90 text-obedience-white hover:bg-command-black font-inter uppercase text-xs"
                        >
                          {item.type}
                        </Badge>
                      </div>
                      {item.estimated_time && (
                        <div className="absolute top-3 right-3">
                          <Badge 
                            variant="outline" 
                            className="bg-obedience-white/90 text-command-black border-command-black font-inter text-xs"
                          >
                            <Clock className="w-3 h-3 mr-1" />
                            {item.estimated_time}m
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-4 sm:p-6">
                      <h3 className="font-institutional text-command-black text-lg sm:text-xl font-bold mb-2 line-clamp-2 group-hover:text-target-red transition-colors">
                        {item.title}
                      </h3>
                      
                      {item.objective && (
                        <p className="text-gray-600 text-sm font-inter line-clamp-3 mb-4 leading-relaxed">
                          {item.objective}
                        </p>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full group/btn border-command-black text-command-black hover:bg-command-black hover:text-obedience-white transition-all duration-200"
                      >
                        <span className="font-inter uppercase text-xs tracking-wider">
                          {item.type === 'lesson' ? 'Take Lesson' : 'Read Chapter'}
                        </span>
                        <ArrowRight className="w-3 h-3 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <CarouselPrevious className="hidden sm:flex -left-4 lg:-left-12 bg-obedience-white border-command-black text-command-black hover:bg-command-black hover:text-obedience-white" />
            <CarouselNext className="hidden sm:flex -right-4 lg:-right-12 bg-obedience-white border-command-black text-command-black hover:bg-command-black hover:text-obedience-white" />
          </Carousel>
          
          {/* Mobile scroll indicator */}
          <div className="flex justify-center mt-6 sm:hidden">
            <p className="text-gray-500 text-sm font-inter">
              Swipe to explore more content
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}