-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'CREATED';

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "razorpaySignature" DROP NOT NULL;
