# Language Detection Web App

## Overview

A Flask-based web application that compares language detection using two different approaches: traditional n-gram analysis and modern open-source pre-trained models. The application features a modern, animated interface with glassmorphism design elements, smooth transitions, and enhanced user experience. Users can input text and see detection results from both methods side-by-side, allowing comparison of traditional NLP techniques versus modern AI approaches. The app provides confidence scores and supports 55+ languages including English, Spanish, French, German, Japanese, Chinese, Arabic, and many others.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Technology**: Vanilla JavaScript with Bootstrap 5 for UI components
- **Design Pattern**: Single-page application with dynamic content updates and staggered animations
- **Styling**: Bootstrap with dark theme, Font Awesome icons, glassmorphism effects, and gradient animations
- **User Experience**: Enhanced form interactions with typing animations, floating particles, smooth transitions, and real-time validation feedback
- **Animation System**: CSS3 animations, keyframes for floating elements, gradient shifts, and entrance effects

### Backend Architecture
- **Framework**: Flask (Python) following MVC pattern
- **Structure**: Modular design with separate language detection logic
- **API Design**: RESTful endpoint (`/detect`) accepting JSON payloads
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Logging**: Built-in logging for debugging and monitoring

### Language Detection Engine
- **Traditional Method**: Character n-gram based classification using open-source langid library
- **Modern Method**: Open-source pre-trained models via langdetect library (statistical ML approach)
- **Dual Processing**: Supports running both methods simultaneously or individually with animated results display
- **Language Support**: 55+ languages with full language code to name mapping
- **Performance**: Optimized for both accuracy and visual presentation with confidence meters and detailed analysis

### Data Processing
- **Input Validation**: Minimum text length requirements and sanitization
- **Response Format**: Structured JSON with confidence scores and language names
- **Error Handling**: Graceful degradation when one method fails

## External Dependencies

### Python Libraries
- **Flask**: Web framework for API and routing
- **langdetect**: Google's language detection library for pre-trained model approach
- **langid**: Traditional n-gram based language identification
- **logging**: Built-in Python logging for application monitoring

### Frontend Dependencies
- **Bootstrap 5**: CSS framework with custom dark theme and glassmorphism effects
- **Font Awesome 6**: Icon library for animated UI elements
- **Vanilla JavaScript**: Enhanced with modern ES6+ features, animations, and effects
- **CSS3**: Advanced animations, keyframes, backdrop filters, and gradient effects

### Development Tools
- **Python**: Runtime environment
- **Flask development server**: Built-in development server with debug mode
- **Environment variables**: Session secret key configuration

### Browser Requirements
- **Modern browsers**: ES6+ support required for async/await, fetch API, and CSS3 animations
- **JavaScript enabled**: Required for form submission, dynamic updates, and interactive animations
- **CSS3 support**: Required for backdrop filters, gradients, transforms, and keyframe animations

## Academic Project Information

### Team Details
- **Institution**: Thakur College of Engineering and Technology
- **Department**: AI & ML
- **Subject**: Natural Language Processing
- **Developed by**: Adnan Qureshi (Roll No: 67)
- **Under the Guidance of**: Pranjali Sankhe
- **Focus**: Comparative analysis of traditional n-gram and modern pre-trained language detection algorithms

## Recent Changes (August 2025)

### Design Enhancements
- **Removed all references to Gemini 2.5 Pro** and updated branding to focus on open-source technology
- **Glassmorphism UI**: Added backdrop blur effects, semi-transparent backgrounds, and modern card styling
- **Enhanced animations**: Implemented floating particles, rotating globe, gradient text effects, and smooth transitions
- **Interactive elements**: Added typing animation for sample text, enhanced button states, and confidence meters
- **Responsive design**: Improved mobile experience with optimized animations and layouts
- **Project Information Modal**: Added team credits modal with academic project details and team member information

### Technical Improvements
- **Advanced CSS**: Added keyframe animations, cubic-bezier transitions, and gradient backgrounds
- **JavaScript enhancements**: Implemented staggered animations, element reveal effects, and smooth scrolling
- **Form interactions**: Real-time character count feedback, enhanced loading states, and visual validation
- **Performance**: Optimized animations for smooth 60fps performance across devices
- **Complete Responsive Design**: Comprehensive breakpoint coverage (576px to 1400px+) with mobile-first approach
- **Accessibility Features**: Enhanced focus states, touch-friendly interactions, and reduced motion preferences