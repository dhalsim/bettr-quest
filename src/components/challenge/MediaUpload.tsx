
import React, { useState, useRef } from 'react';
import { XCircle, Image, Video, Mic, Play, Trash, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MediaUploadProps {
  onMediaChange?: (files: {
    image: File | null,
    video: File | null,
    audio: Blob | null
  }) => void;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ onMediaChange }) => {
  // Media states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  
  // Audio recording states
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<BlobPart[]>([]);

  // Notify parent component of media changes
  const notifyMediaChange = () => {
    if (onMediaChange) {
      onMediaChange({
        image: imageFile,
        video: videoFile,
        audio: audioBlob
      });
    }
  };
  
  // Handle media file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'image') {
          setImageFile(file);
          setImagePreview(reader.result as string);
        } else {
          setVideoFile(file);
          setVideoPreview(reader.result as string);
        }
        notifyMediaChange();
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Audio recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      audioChunks.current = [];
      
      const recorder = new MediaRecorder(stream);
      mediaRecorder.current = recorder;
      
      recorder.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        setAudioBlob(audioBlob);
        setIsRecording(false);
        notifyMediaChange();
      };
      
      recorder.start();
    } catch (error) {
      console.error("Error starting recording:", error);
      setIsRecording(false);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      // Stop all audio tracks
      if (mediaRecorder.current.stream) {
        mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      }
    }
  };
  
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const playAudio = () => {
    if (audioURL) {
      const audio = new Audio(audioURL);
      audio.play();
    }
  };
  
  const removeAudio = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    setAudioURL(null);
    setAudioBlob(null);
    notifyMediaChange();
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);
    notifyMediaChange();
  };

  const removeVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVideoFile(null);
    setVideoPreview(null);
    notifyMediaChange();
  };
  
  return (
    <div className="mb-8 space-y-6">
      <h2 className="text-lg font-medium mb-3">Challenge Media</h2>
      
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Image (Optional)
        </label>
        <div
          className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
            imagePreview ? 'border-primary/50' : 'border-border hover:bg-secondary/50'
          } cursor-pointer`}
          onClick={() => document.getElementById('challenge-image')?.click()}
        >
          <input
            type="file"
            id="challenge-image"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e, 'image')}
          />
          
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Challenge Preview"
                className="w-full h-48 object-cover rounded-md"
              />
              <button
                type="button"
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                onClick={removeImage}
              >
                <XCircle size={18} />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <Image className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Click to upload an image for your challenge
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG up to 10MB
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Video Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Video (Optional)
        </label>
        <div
          className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
            videoPreview ? 'border-primary/50' : 'border-border hover:bg-secondary/50'
          } cursor-pointer`}
          onClick={() => document.getElementById('challenge-video')?.click()}
        >
          <input
            type="file"
            id="challenge-video"
            accept="video/*"
            className="hidden"
            onChange={(e) => handleFileChange(e, 'video')}
          />
          
          {videoPreview ? (
            <div className="relative">
              <video
                src={videoPreview}
                controls
                className="w-full h-48 object-cover rounded-md"
              />
              <button
                type="button"
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                onClick={removeVideo}
              >
                <XCircle size={18} />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <Video className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Click to upload a video for your challenge
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                MP4, WebM up to 100MB
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Audio Recording */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Audio Recording (Optional)
        </label>
        
        {audioURL ? (
          <div className="flex items-center gap-3 bg-secondary/30 p-4 rounded-lg">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={playAudio}
              className="h-10 w-10 rounded-full"
            >
              <Play size={16} />
            </Button>
            <div className="flex-1">
              <div className="h-2 bg-primary/30 rounded-full">
                <div className="h-2 w-1/3 bg-primary rounded-full"></div>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={removeAudio}
              className="h-8 w-8 rounded-full"
            >
              <Trash size={14} />
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant={isRecording ? "destructive" : "outline"}
            onClick={toggleRecording}
            className="w-full h-14 gap-2"
          >
            {isRecording ? (
              <>
                <span className="animate-pulse h-2 w-2 rounded-full bg-current"></span>
                Recording... Click to stop
              </>
            ) : (
              <>
                <Mic size={16} /> Click to record audio
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default MediaUpload;
