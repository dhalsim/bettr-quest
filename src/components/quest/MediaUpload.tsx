
import React, { useState, useRef, useEffect } from 'react';
import { Upload, Image, Video, Mic, Trash2, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface MediaUploadProps {
  onMediaChange: (files: {
    image: File | null,
    video: File | null,
    audio: Blob | null,
    recordedVideo: Blob | null
  }) => void;
  previewUrl?: string;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ onMediaChange, previewUrl }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);
  
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingType, setRecordingType] = useState<'audio' | 'video' | null>(null);
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  
  // Handle prefilled image URL when provided
  useEffect(() => {
    if (previewUrl) {
      setImagePreviews(prev => [...prev, previewUrl]);
    }
  }, [previewUrl]);
  
  // Notify parent component when media changes
  useEffect(() => {
    onMediaChange({
      image: selectedImage,
      video: selectedVideo,
      audio: recordedAudio,
      recordedVideo: recordedVideo
    });
  }, [selectedImage, selectedVideo, recordedAudio, recordedVideo, onMediaChange]);
  
  // Clean up media streams when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // Create URL for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreviews([e.target.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle video selection
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedVideo(e.target.files[0]);
    }
  };
  
  // Clear all media
  const handleClearMedia = () => {
    setSelectedImage(null);
    setSelectedVideo(null);
    setRecordedAudio(null);
    setRecordedVideo(null);
    setImagePreviews([]);
    
    // Reset file input values
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  };
  
  // Start audio/video recording
  const startRecording = async (type: 'audio' | 'video') => {
    try {
      // Request media permissions
      const constraints = {
        audio: true,
        video: type === 'video'
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      // If video, set the stream to the video element for preview
      if (type === 'video' && videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }
      
      // Setup media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: type === 'audio' ? 'audio/wav' : 'video/webm'
        });
        
        if (type === 'audio') {
          setRecordedAudio(blob);
        } else {
          setRecordedVideo(blob);
        }
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        streamRef.current = null;
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingType(type);
      
    } catch (err) {
      console.error('Error accessing media devices:', err);
      alert('Could not access your microphone or camera. Please check your permissions.');
      setShowRecordingModal(false);
    }
  };
  
  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingType(null);
    }
  };
  
  // Handle opening recording modal
  const openRecordingModal = (type: 'audio' | 'video') => {
    setShowRecordingModal(true);
    setTimeout(() => startRecording(type), 500); // Short delay to let the modal open
  };
  
  // Handle closing recording modal
  const closeRecordingModal = () => {
    stopRecording();
    setShowRecordingModal(false);
  };
  
  return (
    <div className="mb-6">
      <h3 className="block text-sm font-medium mb-4">Add Media (Optional)</h3>
      
      <div className="flex flex-wrap gap-3 mb-4">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => imageInputRef.current?.click()}
        >
          <Image size={16} className="mr-2" />
          Image
        </Button>
        
        <Button 
          type="button" 
          variant="outline"
          onClick={() => videoInputRef.current?.click()}
        >
          <Video size={16} className="mr-2" />
          Video
        </Button>
        
        <Button 
          type="button" 
          variant="outline"
          onClick={() => openRecordingModal('audio')}
        >
          <Mic size={16} className="mr-2" />
          Record Audio
        </Button>
        
        <Button 
          type="button" 
          variant="outline"
          onClick={() => openRecordingModal('video')}
        >
          <Camera size={16} className="mr-2" />
          Record Video
        </Button>
        
        {(selectedImage || selectedVideo || recordedAudio || recordedVideo || imagePreviews.length > 0) && (
          <Button 
            type="button" 
            variant="destructive"
            onClick={handleClearMedia}
          >
            <Trash2 size={16} className="mr-2" />
            Clear Media
          </Button>
        )}
      </div>
      
      {/* Hidden file inputs */}
      <input 
        type="file" 
        accept="image/*" 
        ref={imageInputRef} 
        className="hidden"
        onChange={handleImageChange}
      />
      <input 
        type="file" 
        accept="video/*" 
        ref={videoInputRef} 
        className="hidden"
        onChange={handleVideoChange}
      />
      
      {/* Media Previews */}
      <div className="mt-4 space-y-2">
        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="mb-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {imagePreviews.map((src, idx) => (
                <div key={idx} className="relative h-40 rounded-md overflow-hidden">
                  <img 
                    src={src} 
                    alt={`Preview ${idx + 1}`} 
                    className="h-full w-full object-cover" 
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Video Preview */}
        {selectedVideo && (
          <div className="mb-3">
            <h4 className="text-sm font-medium mb-1">Video Selected:</h4>
            <p className="text-sm text-muted-foreground">{selectedVideo.name}</p>
          </div>
        )}
        
        {/* Audio Preview */}
        {recordedAudio && (
          <div className="mb-3">
            <h4 className="text-sm font-medium mb-1">Audio Recorded:</h4>
            <audio controls className="w-full">
              <source src={URL.createObjectURL(recordedAudio)} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
        
        {/* Recorded Video Preview */}
        {recordedVideo && (
          <div className="mb-3">
            <h4 className="text-sm font-medium mb-1">Video Recorded:</h4>
            <video controls className="w-full max-h-60 rounded-md">
              <source src={URL.createObjectURL(recordedVideo)} type="video/webm" />
              Your browser does not support the video element.
            </video>
          </div>
        )}
      </div>
      
      {/* Recording Dialog */}
      <Dialog open={showRecordingModal} onOpenChange={setShowRecordingModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {recordingType === 'audio' ? 'Recording Audio' : 'Recording Video'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center py-4">
            {recordingType === 'video' && (
              <video 
                ref={videoPreviewRef} 
                autoPlay 
                muted 
                className="w-full h-64 bg-black rounded-md mb-4"
              />
            )}
            
            {recordingType === 'audio' && (
              <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mb-4">
                <Mic size={32} className="text-white" />
              </div>
            )}
            
            <div className="flex space-x-3 mt-4">
              {isRecording ? (
                <Button 
                  variant="destructive"
                  onClick={stopRecording}
                >
                  Stop Recording
                </Button>
              ) : (
                <Button 
                  variant="default"
                  onClick={() => startRecording(recordingType || 'audio')}
                >
                  Start Recording
                </Button>
              )}
              
              <Button 
                variant="outline"
                onClick={closeRecordingModal}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaUpload;
