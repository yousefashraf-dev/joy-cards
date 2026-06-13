import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import ScrollToTop from "@/components/ui/ScrollToTop";
import LoadingProvider from "@/components/ui/LoadingProvider";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import ToastProvider from "@/components/ui/ToastProvider";
import Toast from "@/components/ui/Toast";
import OnboardingTour from "@/components/ui/OnboardingTour";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <LoadingProvider>
      <ToastProvider>
        <ScrollToTop />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsApp />
        <LoadingOverlay />
        <Toast />
        <OnboardingTour />
      </ToastProvider>
    </LoadingProvider>
  );
}
