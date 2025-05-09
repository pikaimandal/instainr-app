"use client"

import { X } from "lucide-react"

interface SecurityModalProps {
  onClose: () => void
}

export default function SecurityModal({ onClose }: SecurityModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">How InstaINR Works</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Conversion Process</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              When you convert your crypto to INR, your tokens are sent to our secure wallet. We then process the
              conversion and send the equivalent INR amount to your preferred payment method within 30 minutes.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Data Privacy</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We only collect the information necessary to process your conversions. Your withdrawal details are
              securely stored and never shared with third parties.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Fee Structure</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              InstaINR charges a 5% commission on all conversions. This fee covers transaction costs, exchange rate
              fluctuations, and operational expenses.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Support</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Need help? Contact our support team on Twitter/X:
              <a
                href="https://x.com/insta_inr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 ml-1"
              >
                @insta_inr
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
