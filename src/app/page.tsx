'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Moon, Sun, Home, Building, Users, Mail, Phone, MapPin, Star, Calendar, DollarSign } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MouseTracker, AnimatedCard, AnimatedCounter, AnimatedButton, AnimatedBackground, StaggeredList, ParallaxSection } from '@/components/ui/mouse-tracker';

const LandingPage = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const features = [
    {
      icon: <DollarSign className="w-8 h-8 text-primary" />,
      title: "Payment Tracking",
      description: "Record and track all rental payments with automated reminders and late penalty calculations."
    },
    {
      icon: <Calendar className="w-8 h-8 text-primary" />,
      title: "Automated Reminders",
      description: "Email notifications for upcoming rent payments and overdue alerts."
    },
    {
      icon: <Building className="w-8 h-8 text-primary" />,
      title: "Property Management",
      description: "Comprehensive management for rental properties and Airbnb listings."
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Tenant Management",
      description: "Streamlined tenant communication and lease management."
    }
  ];

  const properties = [
    {
      id: 1,
      title: "Luxury Downtown Apartment",
      location: "Nairobi, Kenya",
      price: "KES 85,000/month",
      type: "Apartment",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Modern Family Villa",
      location: "Karen, Kenya",
      price: "KES 150,000/month",
      type: "Villa",
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Cozy Studio Apartment",
      location: "Westlands, Kenya",
      price: "KES 45,000/month",
      type: "Studio",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2b9d4b4?w=500&h=300&fit=crop"
    }
  ];

  return (
    <MouseTracker>
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-2"
            >
              <img 
                src="https://simonimageurl.netlify.app/images/boma-logo.png" 
                alt="Boma Properties Ltd" 
                className="h-10 w-auto"
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:flex items-center space-x-8"
            >
              {['home', 'properties', 'features', 'contact'].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item}`}
                  className="text-foreground hover:text-primary transition-colors relative group"
                  whileHover={{ scale: 1.05 }}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.a>
              ))}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center space-x-4"
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className="w-10 h-10"
                >
                  {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </Button>
              </motion.div>
              
              <div className="hidden md:flex space-x-2">
                <AnimatedButton variant="default" onClick={() => window.location.href = '/auth/login'}>
                  Login
                </AnimatedButton>
                <AnimatedButton variant="bounce" onClick={() => window.location.href = '/auth/register'}>
                  Sign Up
                </AnimatedButton>
              </div>
            </motion.div>
          </div>
        </nav>

        {/* Hero Section */}
        <ParallaxSection speed={0.3} className="pt-24 pb-16 px-4">
          <AnimatedBackground>
            <div className="container mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center md:text-left"
                >
                  <motion.h1 
                    className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    Boma Properties Ltd
                  </motion.h1>
                  <motion.p 
                    className="text-xl md:text-2xl mb-8 text-muted-foreground"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    Professional Property Management for Rental Properties & Airbnb
                  </motion.p>
                  <motion.p 
                    className="text-lg mb-8 text-muted-foreground"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    Streamline your rental business with our comprehensive property management system. 
                    Track payments, automate reminders, and manage tenants efficiently.
                  </motion.p>
                  <StaggeredList staggerDelay={0.2} className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <AnimatedButton variant="pulse" className="text-lg px-8 py-3">
                      Get Started
                    </AnimatedButton>
                    <AnimatedButton variant="default" className="text-lg px-8 py-3">
                      Learn More
                    </AnimatedButton>
                  </StaggeredList>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative"
                >
                  <motion.div
                    className="relative rounded-2xl overflow-hidden shadow-2xl"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop"
                      alt="Luxury Property"
                      className="w-full h-auto"
                    />
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1 }}
                    />
                  </motion.div>
                  
                  {/* Floating Elements */}
                  <motion.div
                    className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full blur-xl"
                    animate={{
                      x: [0, 10, 0],
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  <motion.div
                    className="absolute -bottom-4 -left-4 w-16 h-16 bg-accent/20 rounded-full blur-xl"
                    animate={{
                      x: [0, -10, 0],
                      y: [0, 10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </motion.div>
              </div>
            </div>
          </AnimatedBackground>
        </ParallaxSection>

        {/* Features Section */}
        <ParallaxSection speed={0.2} className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Boma Properties?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our comprehensive property management system provides everything you need to run your rental business efficiently.
              </p>
            </motion.div>

            <StaggeredList staggerDelay={0.1} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <AnimatedCard key={index} delay={index * 0.1}>
                  <Card className="h-full text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <motion.div 
                        className="flex justify-center mb-4"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {feature.icon}
                      </motion.div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              ))}
            </StaggeredList>
          </div>
        </ParallaxSection>

        {/* Properties Section */}
        <ParallaxSection speed={0.1} className="py-16 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Properties</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover our curated selection of premium rental properties and Airbnb listings.
              </p>
            </motion.div>

            <StaggeredList staggerDelay={0.15} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property, index) => (
                <AnimatedCard key={property.id} delay={index * 0.15} direction="up">
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    <motion.div 
                      className="relative h-48 overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img 
                        src={property.image} 
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                      <motion.div 
                        className="absolute top-4 right-4"
                        whileHover={{ scale: 1.1 }}
                      >
                        <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                          {property.type}
                        </span>
                      </motion.div>
                    </motion.div>
                    <CardHeader>
                      <CardTitle className="text-xl">{property.title}</CardTitle>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{property.location}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-primary font-semibold">
                          <DollarSign className="w-4 h-4 mr-1" />
                          <span>{property.price}</span>
                        </div>
                        <AnimatedButton variant="default" size="sm">
                          View Details
                        </AnimatedButton>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              ))}
            </StaggeredList>
          </div>
        </ParallaxSection>

        {/* CTA Section */}
        <motion.section 
          className="py-16 px-4 bg-primary text-primary-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Streamline Your Property Management?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join hundreds of property owners who trust Boma Properties Ltd.
              </p>
              <AnimatedButton variant="bounce" className="text-lg px-8 py-3 bg-secondary text-secondary-foreground">
                Get Started Today
              </AnimatedButton>
            </motion.div>
          </div>
        </motion.section>

        {/* Contact Section */}
        <ParallaxSection speed={0.1} className="py-16 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Have questions? We'd love to hear from you. Get in touch with our team.
              </p>
            </motion.div>

            <StaggeredList staggerDelay={0.1} className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  icon: <Phone className="w-8 h-8 text-primary" />,
                  title: "Phone",
                  content: "+254 123 456 789"
                },
                {
                  icon: <Mail className="w-8 h-8 text-primary" />,
                  title: "Email",
                  content: "info@bomaproperties.co.ke"
                },
                {
                  icon: <MapPin className="w-8 h-8 text-primary" />,
                  title: "Office",
                  content: "Nairobi, Kenya"
                }
              ].map((item, index) => (
                <AnimatedCard key={index} delay={index * 0.1} direction="up">
                  <motion.div 
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.content}</p>
                  </motion.div>
                </AnimatedCard>
              ))}
            </StaggeredList>
          </div>
        </ParallaxSection>

        {/* Footer */}
        <motion.footer 
          className="bg-muted/50 py-8 px-4 border-t border-border"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <motion.div 
                className="flex items-center space-x-2 mb-4 md:mb-0"
                whileHover={{ scale: 1.05 }}
              >
                <img 
                  src="https://simonimageurl.netlify.app/images/boma-logo.png" 
                  alt="Boma Properties Ltd" 
                  className="h-8 w-auto"
                />
                {/* <span className="font-semibold">Boma Properties Ltd</span> */}
              </motion.div>
              <div className="text-center md:text-right text-muted-foreground">
                <p>&copy; 2025 Boma Properties Ltd. All rights reserved.</p>
              </div>
            </div>
          </div>
        </motion.footer>
      </div>
    </MouseTracker>
  );
};

export default LandingPage;