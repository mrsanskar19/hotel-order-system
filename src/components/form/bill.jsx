const renderBill = () => {
    const subtotal = activeOrder.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const tax = subtotal * 0.085
    const service = subtotal * 0.15
    const total = subtotal + tax + service

    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {activeOrder.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (8.5%)</span>
              <span className="text-foreground">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service Charge (15%)</span>
              <span className="text-foreground">${service.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span className="text-foreground">Total</span>
              <span className="text-foreground">${total.toFixed(2)}</span>
            </div>
          </div>

          <Button onClick={() => setStep("payment")} className="w-full">
            <CreditCard className="h-4 w-4 mr-2" />
            Proceed to Payment
          </Button>
        </CardContent>
      </Card>
    )
  }

  const renderPayment = () => (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          UPI Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-lg mb-4">
            <DollarSign className="h-5 w-5" />
            <span className="text-xl font-bold">${activeOrder.total}</span>
          </div>
          <p className="text-muted-foreground mb-6">Scan the QR code below to complete payment</p>
        </div>

        {qrCodeUrl && (
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <img src={qrCodeUrl || "/placeholder.svg"} alt="UPI Payment QR Code" className="w-64 h-64 mx-auto" />
            </div>
          </div>
        )}

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">UPI ID: {UPI_ID}</p>
          <p className="text-sm text-muted-foreground">Payee: {PAYEE_NAME}</p>
        </div>

        <div className="space-y-3">
          <Button onClick={handleCloseOrder} disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </div>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Paid
              </>
            )}
          </Button>
          <Button variant="outline" onClick={() => setStep("bill")} className="w-full">
            Back to Bill
          </Button>
        </div>
      </CardContent>
    </Card>
  )