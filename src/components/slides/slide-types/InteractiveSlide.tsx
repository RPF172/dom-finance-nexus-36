import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ModuleSlide } from '@/hooks/useModuleSlides';
import { SlideStage } from '../SlideStage';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Upload, Camera } from 'lucide-react';

interface InteractiveSlideProps {
  slide: ModuleSlide;
  onSubmission?: (data: any) => void;
}

export const InteractiveSlide: React.FC<InteractiveSlideProps> = ({ 
  slide, 
  onSubmission 
}) => {
  const [textResponse, setTextResponse] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const config = slide.interactive_config;
  const taskType = config.task;
  const mediaAspectRatio = config.aspectRatio || 'auto';

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!textResponse && !selectedFile) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmission?.({
        moduleId: slide.module_id,
        slideId: slide.id,
        textResponse: textResponse || undefined,
        mediaFile: selectedFile || undefined,
        metadata: { taskType, config },
      });
      
      // Reset form
      setTextResponse('');
      setSelectedFile(null);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTaskInput = () => {
    switch (taskType) {
      case 'repeat_text':
        return (
          <div className="space-y-6">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground text-center"
            >
              Write "{config.text}" {config.times} times:
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Textarea
                value={textResponse}
                onChange={(e) => setTextResponse(e.target.value)}
                placeholder={`${config.text}\n`.repeat(config.times)}
                rows={Math.min(config.times + 2, 10)}
                className="w-full text-lg resize-none bg-background/80 backdrop-blur-sm"
              />
            </motion.div>
          </div>
        );
        
      case 'photo_upload':
        return (
          <div className="space-y-6">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground text-center"
            >
              Upload proof of your obedience:
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col items-center space-y-4"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/20 transition-all duration-300 bg-background/80 backdrop-blur-sm"
              >
                {selectedFile ? (
                  <div className="text-center">
                    <Camera className="h-10 w-10 text-primary mx-auto mb-3" />
                    <p className="text-base font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">Click to change</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-base text-muted-foreground">Click to upload photo</p>
                    <p className="text-sm text-muted-foreground/70 mt-1">JPEG, PNG, or WebP</p>
                  </div>
                )}
              </label>
            </motion.div>
          </div>
        );
        
      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Textarea
              value={textResponse}
              onChange={(e) => setTextResponse(e.target.value)}
              placeholder="Enter your response..."
              rows={6}
              className="w-full text-lg bg-background/80 backdrop-blur-sm"
            />
          </motion.div>
        );
    }
  };

  const isValid = () => {
    if (taskType === 'repeat_text') {
      const expectedLines = Array(config.times).fill(config.text);
      const actualLines = textResponse.trim().split('\n').filter(line => line.trim());
      return actualLines.length === config.times && 
             actualLines.every(line => line.trim() === config.text);
    }
    if (taskType === 'photo_upload') {
      return !!selectedFile;
    }
    return textResponse.trim().length > 0;
  };

  return (
    <SlideStage
      mediaUrl={slide.media_url}
      mediaAspectRatio={mediaAspectRatio}
      backgroundType={slide.media_url ? "blur" : "solid"}
      overlayIntensity={slide.media_url ? "medium" : "none"}
      animation="slide"
      className="w-full h-full"
    >
      <div className="max-w-3xl w-full">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-5xl lg:text-6xl font-institutional font-bold uppercase tracking-wider text-destructive text-center mb-6"
        >
          {slide.title}
        </motion.h1>
        
        {slide.body && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-foreground/90 text-center mb-8 max-w-2xl mx-auto"
          >
            {slide.body}
          </motion.p>
        )}
        
        <div className="space-y-8">
          {renderTaskInput()}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center"
          >
            <Button
              onClick={handleSubmit}
              disabled={!isValid() || isSubmitting}
              size="lg"
              className="px-8 py-4 text-lg font-institutional uppercase tracking-wider min-w-[200px]"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Response'}
            </Button>
          </motion.div>
        </div>
      </div>
    </SlideStage>
  );
};