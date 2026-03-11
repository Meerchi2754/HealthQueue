import { Gender, PaymentMethod } from "@/app/generated/prisma/enums";

export const useRazorpay = (): {
  initiatePayment: (args: {
    doctorId: number;
    slotTime: string;
    date: string;
    patientId: number;
    gender: Gender;
    paymentMethod: PaymentMethod;
    onSuccess: () => void;
    onFailure: () => void;
  }) => Promise<void>;
} => {
  const loadScript = () =>
    new Promise<boolean>((resolve) => {
      if (document.getElementById("razorpay-script")) return resolve(true);

      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const initiatePayment = async ({
    doctorId,
    slotTime,
    date,
    patientId,
    gender,
    paymentMethod,
    onSuccess,
    onFailure,
  }: {
    doctorId: number;
    slotTime: string;
    date: string;
    patientId: number;
    gender: Gender;
    paymentMethod: PaymentMethod;
    onSuccess: () => void;
    onFailure: () => void;
  }) => {
    const loaded = await loadScript();
    if (!loaded) {
      alert("Razorpay SDK failed to load");
      return;
    }

    const res = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        doctorId,
        slotTime,
        date,
        patientId,
        gender,
        paymentMethod,
      }),
    });

    const { orderId, amount, currency, appointmentId } = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount,
      currency,
      order_id: orderId,
      name: "HEALTHQUEUE",
      description: "Appointment Center",

      handler: async (response: any) => {
        const verify = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            doctorId,
            slotTime,
            date,
            patientId,
            gender,
            paymentMethod,
            amount,
            currency,
          }),
        });

        const result = await verify.json();

        result.success ? onSuccess() : onFailure();
      },
      modal: {
        ondismiss: function () {
          onFailure(); // 🔥 triggered when user closes Razorpay popup
        },
      },
      theme: { color: "#6366f1" },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.on("payment.failed", onFailure);
    rzp.open();
  };

  return { initiatePayment };
};
