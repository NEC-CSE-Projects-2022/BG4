import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Eye, 
  Upload, 
  CheckCircle, 
  Layers, 
  Activity, 
  Brain, 
  Sparkles, 
  FileText,
  ArrowRight,
  Shield,
  Zap
} from 'lucide-react';

const Home = () => {
  const pipelineSteps = [
    { icon: Upload, title: 'Upload', desc: 'Retinal fundus image' },
    { icon: CheckCircle, title: 'Validate', desc: 'Image verification' },
    { icon: Sparkles, title: 'Preprocess', desc: 'Image enhancement' },
    { icon: Layers, title: 'Segment', desc: 'Disc & cup extraction' },
    { icon: Activity, title: 'CDR', desc: 'Ratio computation' },
    { icon: Brain, title: 'Classify', desc: 'AI prediction' },
    { icon: Eye, title: 'Explain', desc: 'Grad-CAM visualization' },
    { icon: FileText, title: 'Report', desc: 'Clinical summary' },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Clinical Accuracy',
      desc: 'State-of-the-art deep learning models trained on validated medical datasets'
    },
    {
      icon: Zap,
      title: 'Instant Analysis',
      desc: 'Complete screening pipeline executes in seconds with detailed results'
    },
    {
      icon: Eye,
      title: 'Explainable AI',
      desc: 'Grad-CAM visualizations show exactly what the model focuses on'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-medical opacity-5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%)]" />
        
        <div className="container mx-auto px-4 py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent rounded-full mb-6">
              <Eye className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-accent-foreground">
                AI-Powered Glaucoma Detection
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              FusionNet-Vision
              <span className="block text-primary mt-2">Glaucoma Detection System</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Advanced AI-powered screening for early glaucoma detection using 
              deep learning segmentation and classification with explainable results.
            </p>
            
            <Link to="/upload">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="medical-button inline-flex items-center gap-2 text-lg px-8 py-4"
              >
                Start Screening
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Pipeline Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Complete Medical Pipeline
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our system follows a rigorous clinical workflow from image upload to final diagnosis
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {pipelineSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="medical-card p-4 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{step.title}</h3>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="medical-card p-8"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="medical-card p-12 text-center max-w-3xl mx-auto"
          >
            <Eye className="w-16 h-16 mx-auto text-primary mb-6" />
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Begin Screening?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Upload a retinal fundus image and receive comprehensive AI-powered 
              analysis with detailed clinical insights in seconds.
            </p>
            <Link to="/upload">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="medical-button inline-flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Fundus Image
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            FusionNet-Vision © 2024 • Research Demo • Not for Clinical Use
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
