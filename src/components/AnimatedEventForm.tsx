"use client";

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Calendar, Clock, MapPin, Image, Award, FileText, Loader2 } from 'lucide-react';

interface AnimatedEventFormProps {
    onSubmit: (eventData: any) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export default function AnimatedEventForm({ onSubmit, onCancel, isLoading = false }: AnimatedEventFormProps) {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        location: '',
        flyer: '',
        certificate: '',
        description: ''
    });

    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [isClosing, setIsClosing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            id: Math.random().toString(36).substr(2, 9),
            participants: 0,
            status: 'upcoming'
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFocus = (fieldName: string) => {
        setFocusedField(fieldName);
    };

    const handleBlur = () => {
        setFocusedField(null);
    };

    const handleCancel = () => {
        setIsClosing(true);
        // Let CSS animation handle the timing, then call onCancel
        setTimeout(() => {
            onCancel();
        }, 150); // Match CSS animation duration (0.15s)
    };

    const getFieldClasses = (fieldName: string, baseClasses: string) => {
        const isFocused = focusedField === fieldName;
        const hasValue = formData[fieldName as keyof typeof formData];

        return `${baseClasses} transition-all duration-200 ease-in-out ${isFocused
                ? 'border-teal-500 ring-2 ring-teal-200 ring-opacity-50 scale-[1.01]'
                : hasValue
                    ? 'border-teal-300'
                    : 'border-gray-200 hover:border-teal-300'
            }`;
    };

    const getLabelClasses = (fieldName: string) => {
        const isFocused = focusedField === fieldName;
        const hasValue = formData[fieldName as keyof typeof formData];

        return `flex items-center gap-2 transition-all duration-200 ease-in-out ${isFocused || hasValue ? 'text-teal-600 scale-105' : 'text-gray-700'
            }`;
    };

    return (
        <div className={`${
            isClosing 
                ? 'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95' 
                : 'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95'
        }`}
        data-state={isClosing ? 'closed' : 'open'}>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Field */}
                <div className="space-y-2 transform transition-all duration-200 ease-in-out hover:translate-y-[-1px]">
                    <Label htmlFor="title" className={getLabelClasses('title')}>
                        <FileText className={`h-4 w-4 transition-colors duration-200 ${focusedField === 'title' ? 'text-teal-600' : 'text-teal-500'
                            }`} />
                        Judul Kegiatan/Event
                    </Label>
                    <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        onFocus={() => handleFocus('title')}
                        onBlur={handleBlur}
                        placeholder="Masukkan judul event"
                        required
                        disabled={isLoading}
                        className={getFieldClasses('title', 'focus:border-teal-500')}
                    />
                </div>

                {/* Date and Time Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 transform transition-all duration-200 ease-in-out hover:translate-y-[-1px]">
                        <Label htmlFor="date" className={getLabelClasses('date')}>
                            <Calendar className={`h-4 w-4 transition-colors duration-200 ${focusedField === 'date' ? 'text-teal-600' : 'text-teal-500'
                                }`} />
                            Tanggal Event
                        </Label>
                        <Input
                            id="date"
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleChange}
                            onFocus={() => handleFocus('date')}
                            onBlur={handleBlur}
                            required
                            disabled={isLoading}
                            className={getFieldClasses('date', 'focus:border-teal-500')}
                        />
                    </div>
                    <div className="space-y-2 transform transition-all duration-200 ease-in-out hover:translate-y-[-1px]">
                        <Label htmlFor="time" className={getLabelClasses('time')}>
                            <Clock className={`h-4 w-4 transition-colors duration-200 ${focusedField === 'time' ? 'text-teal-600' : 'text-teal-500'
                                }`} />
                            Waktu/Jam
                        </Label>
                        <Input
                            id="time"
                            name="time"
                            type="time"
                            value={formData.time}
                            onChange={handleChange}
                            onFocus={() => handleFocus('time')}
                            onBlur={handleBlur}
                            required
                            disabled={isLoading}
                            className={getFieldClasses('time', 'focus:border-teal-500')}
                        />
                    </div>
                </div>

                {/* Location Field */}
                <div className="space-y-2 transform transition-all duration-200 ease-in-out hover:translate-y-[-1px]">
                    <Label htmlFor="location" className={getLabelClasses('location')}>
                        <MapPin className={`h-4 w-4 transition-colors duration-200 ${focusedField === 'location' ? 'text-teal-600' : 'text-teal-500'
                            }`} />
                        Lokasi Event
                    </Label>
                    <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        onFocus={() => handleFocus('location')}
                        onBlur={handleBlur}
                        placeholder="Masukkan lokasi event"
                        required
                        disabled={isLoading}
                        className={getFieldClasses('location', 'focus:border-teal-500')}
                    />
                </div>

                {/* Flyer Field */}
                <div className="space-y-2 transform transition-all duration-200 ease-in-out hover:translate-y-[-1px]">
                    <Label htmlFor="flyer" className={getLabelClasses('flyer')}>
                        <Image className={`h-4 w-4 transition-colors duration-200 ${focusedField === 'flyer' ? 'text-teal-600' : 'text-teal-500'
                            }`} />
                        URL Flyer Event
                    </Label>
                    <Input
                        id="flyer"
                        name="flyer"
                        type="url"
                        value={formData.flyer}
                        onChange={handleChange}
                        onFocus={() => handleFocus('flyer')}
                        onBlur={handleBlur}
                        placeholder="https://example.com/flyer.jpg"
                        disabled={isLoading}
                        className={getFieldClasses('flyer', 'focus:border-teal-500')}
                    />
                </div>

                {/* Certificate Field */}
                <div className="space-y-2 transform transition-all duration-200 ease-in-out hover:translate-y-[-1px]">
                    <Label htmlFor="certificate" className={getLabelClasses('certificate')}>
                        <Award className={`h-4 w-4 transition-colors duration-200 ${focusedField === 'certificate' ? 'text-teal-600' : 'text-teal-500'
                            }`} />
                        URL Template Sertifikat
                    </Label>
                    <Input
                        id="certificate"
                        name="certificate"
                        type="url"
                        value={formData.certificate}
                        onChange={handleChange}
                        onFocus={() => handleFocus('certificate')}
                        onBlur={handleBlur}
                        placeholder="https://example.com/certificate.jpg"
                        disabled={isLoading}
                        className={getFieldClasses('certificate', 'focus:border-teal-500')}
                    />
                </div>

                {/* Description Field */}
                <div className="space-y-2 transform transition-all duration-200 ease-in-out hover:translate-y-[-1px]">
                    <Label htmlFor="description" className={getLabelClasses('description')}>
                        <FileText className={`h-4 w-4 transition-colors duration-200 ${focusedField === 'description' ? 'text-teal-600' : 'text-teal-500'
                            }`} />
                        Deskripsi Event
                    </Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        onFocus={() => handleFocus('description')}
                        onBlur={handleBlur}
                        placeholder="Deskripsikan event Anda secara detail..."
                        rows={4}
                        disabled={isLoading}
                        className={getFieldClasses('description', 'focus:border-teal-500 resize-none')}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-teal-600 hover:bg-teal-700 text-white transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Membuat Event...
                            </>
                        ) : (
                            'Buat Event'
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isLoading || isClosing}
                        className="flex-1 border-teal-300 text-teal-700 hover:bg-teal-50 transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {isClosing ? 'Menutup...' : 'Batal'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
