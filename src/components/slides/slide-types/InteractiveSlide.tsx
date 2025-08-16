import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ModuleSlide } from '@/hooks/useModuleSlides';
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
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground text-center">
              Write "{config.text}" {config.times} times:
            </p>
            <Textarea
              value={textResponse}
              onChange={(e) => setTextResponse(e.target.value)}
              placeholder={`${config.text}\n`.repeat(config.times)}
              rows={Math.min(config.times + 2, 10)}
              className="w-full text-lg resize-none"
            />
          </div>
        );
        
      case 'photo_upload':
        return (
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground text-center">
              Upload proof of your obedience:
            </p>
            <div className="flex flex-col items-center space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/20 transition-colors"
              >
                {selectedFile ? (
                  <div className="text-center">
                    <Camera className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload photo</p>
                  </div>
                )}
              </label>
            </div>
          </div>
        );
        
      default:
        return (
          <Textarea
            value={textResponse}
            onChange={(e) => setTextResponse(e.target.value)}
            placeholder="Enter your response..."
            rows={6}
            className="w-full text-lg"
          />
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
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-6xl font-institutional font-bold uppercase tracking-wider text-destructive text-center mb-8"
        >
          {slide.title}
        </motion.h1>
        
        {slide.body && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-foreground/80 text-center mb-8"
          >
            {slide.body}
          </motion.p>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          {renderTaskInput()}
          
          <div className="flex justify-center">
            <Button
              onClick={handleSubmit}
              disabled={!isValid() || isSubmitting}
              size="lg"
              className="px-8 py-3 text-lg font-institutional uppercase tracking-wider"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Response'}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};