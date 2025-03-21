
import React, { useState, useRef } from 'react';
import { XCircle, Image, Video, Mic, Camera, Play, Trash, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MediaUploadProps {
  onMediaChange?: (files: {
    image: File | null,
    video: File | null,
    audio: Blob | null,
    recordedVideo: Blob | null
  }) => void;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ onMediaChange }) => {
  // Media upload states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  
  // Audio recording states
  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const audioRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<BlobPart[]>([]);
  
  // Video recording states
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [recordedVideoURL, setRecordedVideoURL] = useState<string | null>(null);
  const [recordedVideoBlob, setRecordedVideoBlob] = useState<Blob | null>(null);
  const videoRecorder = useRef<MediaRecorder | null>(null);
  const videoChunks = useRef<BlobPart[]>([]);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);

  // Notify parent component of media changes
  const notifyMediaChange = () => {
    if (onMediaChange) {
      onMediaChange({
        image: imageFile,
        video: videoFile,
        audio: audioBlob,
        recordedVideo: recordedVideoBlob
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
  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsAudioRecording(true);
      audioChunks.current = [];
      
      const recorder = new MediaRecorder(stream);
      audioRecorder.current = recorder;
      
      recorder.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        setAudioBlob(audioBlob);
        setIsAudioRecording(false);
        notifyMediaChange();
      };
      
      recorder.start();
    } catch (error) {
      console.error("Error starting audio recording:", error);
      setIsAudioRecording(false);
    }
  };
  
  const stopAudioRecording = () => {
    if (audioRecorder.current) {
      audioRecorder.current.stop();
      // Stop all audio tracks
      if (audioRecorder.current.stream) {
        audioRecorder.current.stream.getTracks().forEach(track => track.stop());
      }
    }
  };
  
  const toggleAudioRecording = () => {
    if (isAudioRecording) {
      stopAudioRecording();
    } else {
      startAudioRecording();
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
  
  // Video recording functions
  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true
      });
      
      setIsVideoRecording(true);
      videoChunks.current = [];
      
      // Display live preview
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play();
      }
      
      videoStreamRef.current = stream;
      
      const recorder = new MediaRecorder(stream);
      videoRecorder.current = recorder;
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          videoChunks.current.push(e.data);
        }
      };
      
      recorder.onstop = () => {
        const videoBlob = new Blob(videoChunks.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(videoBlob);
        setRecordedVideoURL(videoUrl);
        setRecordedVideoBlob(videoBlob);
        setIsVideoRecording(false);
        
        // Stop the live preview
        if (videoStreamRef.current) {
          videoStreamRef.current.getTracks().forEach(track => track.stop());
        }
        
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = null;
        }
        
        notifyMediaChange();
      };
      
      recorder.start(1000); // Collect data every second
    } catch (error) {
      console.error("Error starting video recording:", error);
      setIsVideoRecording(false);
    }
  };
  
  const stopVideoRecording = () => {
    if (videoRecorder.current && videoRecorder.current.state !== 'inactive') {
      videoRecorder.current.stop();
    }
  };
  
  const toggleVideoRecording = () => {
    if (isVideoRecording) {
      stopVideoRecording();
    } else {
      startVideoRecording();
    }
  };
  
  const removeRecordedVideo = () => {
    if (recordedVideoURL) {
      URL.revokeObjectURL(recordedVideoURL);
    }
    
    setRecordedVideoURL(null);
    setRecordedVideoBlob(null);
    
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
      
      {/* Upload Media Section */}
      <div>
        <h3 className="text-sm font-medium mb-2">Upload Media</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Image Upload */}
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
                  Upload an image
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG up to 10MB
                </p>
              </div>
            )}
          </div>
          
          {/* Video Upload */}
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
                  Upload a video
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  MP4, WebM up to 100MB
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Recordings Section */}
      <div>
        <h3 className="text-sm font-medium mb-2">Recordings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Audio Recording */}
          <div>
            <div className="border-2 border-dashed rounded-lg p-6 bg-secondary/30">
              <div className="text-center mb-2">
                <Mic className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Audio Recording</p>
              </div>
              
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
                  variant={isAudioRecording ? "destructive" : "outline"}
                  onClick={toggleAudioRecording}
                  className="w-full h-10 gap-2"
                >
                  {isAudioRecording ? (
                    <>
                      <span className="animate-pulse h-2 w-2 rounded-full bg-current"></span>
                      Recording... Click to stop
                    </>
                  ) : (
                    <>
                      <Mic size={16} /> Record Audio
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
          
          {/* Video Recording */}
          <div>
            <div className="border-2 border-dashed rounded-lg p-6 bg-secondary/30">
              <div className="text-center mb-2">
                <Camera className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Video Recording</p>
              </div>
              
              {recordedVideoURL ? (
                <div className="relative">
                  <video
                    src={recordedVideoURL}
                    controls
                    className="w-full h-36 object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={removeRecordedVideo}
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70"
                  >
                    <Trash size={14} />
                  </Button>
                </div>
              ) : (
                <div>
                  {isVideoRecording ? (
                    <div className="relative">
                      <video
                        ref={videoPreviewRef}
                        className="w-full h-36 object-cover rounded-md"
                        muted
                      />
                      <div className="absolute top-2 right-2">
                        <span className="animate-pulse h-2 w-2 rounded-full bg-red-500 inline-block mr-1"></span>
                        <span className="text-xs bg-black/50 text-white px-2 py-1 rounded-md">Recording</span>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={toggleVideoRecording}
                        className="w-full mt-2"
                      >
                        Stop Recording
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={toggleVideoRecording}
                      className="w-full h-10 gap-2"
                    >
                      <Camera size={16} /> Record Video
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaUpload;
