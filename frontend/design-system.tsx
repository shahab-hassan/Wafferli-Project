// ==================
// only to view all the design system and interact with them nothing to do wi the original system. just representation  of the components and should be removed after deploying the system
// ==================




import { Card } from "@/components/common/card"
import { TextField } from "@/components/common/text-field"
import  {SearchBar}  from "@/components/common/nav-searchbar"
import { Dropdown } from "@/components/common/dropdown"
import { EnhancedCheckbox } from "@/components/common/enhanced-checkbox"
import { EnhancedRadio } from "@/components/common/enhanced-radio"
import { EnhancedSlider } from "@/components/common/enhanced-slider"
import { EnhancedBreadcrumb, SimpleBreadcrumb } from "@/components/common/enhanced-breadcrumb"
import { Button } from "@/components/common/button"
import { ProductCard } from "@/components/cards/product-card"
import { CardSlider } from "@/components/common/card-slider"
import { Search, Mail, User, Lock, Settings, ShoppingCart, Download, Heart, Star } from "lucide-react"

export default function HomePage() {
  const sampleProducts = [
    {
      id: "1",
      title: "Scientific Center",
      subtitle: "Popular with families this week",
      image: "/placeholder.svg?height=200&width=300",
      category: "Landmarks",
      rating: 4.8,
      reviewCount: 423,
      distance: "4.2 km",
      price: "$",
      badge: null,
    },
    {
      id: "2",
      title: "Souq Al-Mubarakiya",
      subtitle: "Trending for authentic shopping",
      image: "/placeholder.svg?height=200&width=300",
      category: "Shopping",
      rating: 4.4,
      reviewCount: 568,
      distance: "1.8 km",
      isFree: true,
      badge: "sponsored" as const,
    },
    {
      id: "3",
      title: "Marina Beach",
      subtitle: "Perfect weather this week",
      image: "/placeholder.svg?height=200&width=300",
      category: "Beach",
      rating: 4.3,
      reviewCount: 234,
      distance: "6.7 km",
      isFree: true,
      badge: "trending" as const,
    },
    {
      id: "4",
      title: "Kuwait Towers",
      subtitle: "Iconic landmark with great views",
      image: "/placeholder.svg?height=200&width=300",
      category: "Landmarks",
      rating: 4.6,
      reviewCount: 892,
      distance: "3.1 km",
      price: "$",
      badge: null,
    },
    {
      id: "5",
      title: "The Avenues Mall",
      subtitle: "Largest shopping destination",
      image: "/placeholder.svg?height=200&width=300",
      category: "Shopping",
      rating: 4.5,
      reviewCount: 1205,
      distance: "8.3 km",
      isFree: true,
      badge: "sponsored" as const,
    },
  ]

  const ColorCard = ({
    name,
    hex,
    className,
    textColor = "text-white",
    border = "",
  }: {
    name: string
    hex: string
    className: string
    textColor?: string
    border?: string
  }) => (
    <div className={`${className} ${border} rounded-lg p-6 flex flex-col justify-between min-h-[120px]`}>
      <div className={`font-medium ${textColor}`}>{name}</div>
      <div className={`text-sm font-mono ${textColor}`}>{hex}</div>
    </div>
  )

  const TypographyCard = ({
    name,
    fontSize,
    lineHeight,
    className,
  }: {
    name: string
    fontSize: string
    lineHeight: string
    className: string
  }) => (
    <div className="border border-border rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span className="font-medium">{name}</span>
        <div className="flex gap-8">
          <span>Font size: {fontSize}</span>
          <span>Line Height: {lineHeight}</span>
        </div>
      </div>
      <div className={className}>The quick brown fox jumps over the lazy dog</div>
    </div>
  )

  const basicOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ]

  const countryOptions = [
    { value: "us", label: "United States" },
    { value: "uk", label: "United Kingdom" },
    { value: "ca", label: "Canada" },
    { value: "au", label: "Australia" },
  ]

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "pending", label: "Pending" },
    { value: "disabled", label: "Disabled", disabled: true },
  ]

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ]

  const planOptions = [
    { value: "basic", label: "Basic Plan", description: "$9/month - Essential features" },
    { value: "pro", label: "Pro Plan", description: "$19/month - Advanced features" },
    { value: "enterprise", label: "Enterprise Plan", description: "$49/month - All features" },
  ]

  const notificationOptions = [
    { value: "email", label: "Email Only" },
    { value: "sms", label: "SMS Only" },
    { value: "both", label: "Email & SMS" },
    { value: "none", label: "No Notifications" },
  ]

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">
            <span className="text-foreground">1. </span>
            <span className="text-secondary">Colors</span>
          </h1>
          <p className="text-lg text-muted-foreground">Design System Color Palette</p>
        </div>

        {/* Brand Colors */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Brand Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ColorCard name="Primary" hex="#762C85" className="bg-primary" />
            <ColorCard name="Secondary" hex="#E71E86" className="bg-secondary" />
            <ColorCard name="Tertiary" hex="#FECD07" className="bg-tertiary" />
          </div>
        </section>

        {/* State Colors */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">State Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ColorCard name="Info" hex="#00B6F3" className="bg-info" />
            <ColorCard name="Success" hex="#09BA00" className="bg-success" />
            <ColorCard name="Failure" hex="#BA0003" className="bg-failure" />
            <ColorCard name="Warning" hex="#F8C600" className="bg-warning" />
          </div>
        </section>

        {/* Black Colors */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Black Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ColorCard name="1" hex="#000000" className="bg-black-1" textColor="text-white" />
            <ColorCard name="2" hex="#1D1D1D" className="bg-black-2" textColor="text-white" />
            <ColorCard name="3" hex="#282828" className="bg-black-3" textColor="text-white" />
            <ColorCard
              name="White"
              hex="#FFFFFF"
              className="bg-white"
              textColor="text-black"
              border="border border-gray-200"
            />
          </div>
        </section>

        {/* Grey Colors */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Grey Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <ColorCard name="1" hex="#333333" className="bg-grey-1" textColor="text-white" />
            <ColorCard name="2" hex="#4F4F4F" className="bg-grey-2" textColor="text-white" />
            <ColorCard name="3" hex="#828282" className="bg-grey-3" textColor="text-white" />
            <ColorCard name="4" hex="#BDBDBD" className="bg-grey-4" textColor="text-black" />
            <ColorCard name="5" hex="#E0E0E0" className="bg-grey-5" textColor="text-black" />
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">
              <span className="text-foreground">2. </span>
              <span className="text-secondary">Typography</span>
            </h1>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">Inter</h2>
              <p className="text-lg text-muted-foreground">Google Fonts</p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">Headings</h3>
            <div className="grid grid-cols-3 gap-8 text-sm text-muted-foreground font-medium border-b border-border pb-4">
              <span>Name</span>
              <span>Font size</span>
              <span>Line Height</span>
            </div>

            <div className="space-y-6">
              <TypographyCard
                name="Heading 1"
                fontSize="56 px"
                lineHeight="61.6 px"
                className="text-h1 text-foreground"
              />
              <TypographyCard
                name="Heading 2"
                fontSize="48 px"
                lineHeight="52.8 px"
                className="text-h2 text-foreground"
              />
              <TypographyCard
                name="Heading 3"
                fontSize="40 px"
                lineHeight="44 px"
                className="text-h3 text-foreground"
              />
              <TypographyCard
                name="Heading 4"
                fontSize="32 px"
                lineHeight="35.2 px"
                className="text-h4 text-foreground"
              />
              <TypographyCard
                name="Heading 5"
                fontSize="24 px"
                lineHeight="26.4 px"
                className="text-h5 text-foreground"
              />
              <TypographyCard
                name="Heading 6"
                fontSize="20 px"
                lineHeight="22 px"
                className="text-h6 text-foreground"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">Body Text</h3>
            <div className="grid grid-cols-3 gap-8 text-sm text-muted-foreground font-medium border-b border-border pb-4">
              <span>Name</span>
              <span>Font size</span>
              <span>Line Height</span>
            </div>

            <div className="space-y-6">
              <TypographyCard
                name="Large Text Bold"
                fontSize="20 px"
                lineHeight="28 px"
                className="text-large-bold text-foreground"
              />
              <TypographyCard
                name="Large Text Regular"
                fontSize="20 px"
                lineHeight="28 px"
                className="text-large-regular text-foreground"
              />
              <TypographyCard
                name="Medium Text Bold"
                fontSize="18 px"
                lineHeight="25.2 px"
                className="text-medium-bold text-foreground"
              />
              <TypographyCard
                name="Medium Text Regular"
                fontSize="18 px"
                lineHeight="25.2 px"
                className="text-medium-regular text-foreground"
              />
              <TypographyCard
                name="Normal Text Bold"
                fontSize="16 px"
                lineHeight="22.4 px"
                className="text-normal-bold text-foreground"
              />
              <TypographyCard
                name="Normal Text Regular"
                fontSize="16 px"
                lineHeight="22.4 px"
                className="text-normal-regular text-foreground"
              />
              <TypographyCard
                name="Small Text Bold"
                fontSize="14 px"
                lineHeight="19.6 px"
                className="text-small-bold text-foreground"
              />
              <TypographyCard
                name="Small Text Regular"
                fontSize="14 px"
                lineHeight="19.6 px"
                className="text-small-regular text-foreground"
              />
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-6">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Body</span>
              <br />
              Line height and paragraph spacing for body text is 1.4 x font size
            </p>
          </div>
        </section>

        {/* Text Field Components */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">
              <span className="text-foreground">3. </span>
              <span className="text-secondary">Text Fields</span>
            </h1>
            <p className="text-lg text-muted-foreground">Reusable Input Components</p>
          </div>

          <div className="space-y-8">
            {/* Basic Text Fields */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Basic Text Fields</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField label="Basic Field" placeholder="Enter text here" />
                <TextField placeholder="No label field" />
              </div>
            </div>

            {/* Text Fields with Icons */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">With Icons</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField label="Search" placeholder="Search..." icon={<Search size={16} />} />
                <TextField label="Email" placeholder="Enter your email" icon={<Mail size={16} />} type="email" />
              </div>
            </div>
      <h1 className="text-2xl font-bold mb-6">Kuwait Places Search</h1>
      <SearchBar
      />
            {/* Text Fields with Status */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">With Status Messages</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  label="Username"
                  placeholder="Enter username"
                  icon={<User size={16} />}
                  status="Username is available"
                />
                <TextField
                  label="Password"
                  placeholder="Enter password"
                  icon={<Lock size={16} />}
                  type="password"
                  status="Password must be at least 8 characters"
                  error
                />
              </div>
            </div>

            {/* Disabled State */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Disabled State</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField label="Disabled Field" placeholder="This field is disabled" disabled />
                <TextField
                  label="Disabled with Icon"
                  placeholder="Disabled with icon"
                  icon={<Mail size={16} />}
                  disabled
                  status="This field is currently disabled"
                />
              </div>
            </div>

            {/* Usage Examples */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Usage Examples</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6 space-y-4">
                  <h4 className="text-lg font-semibold text-primary">Login Form</h4>
                  <div className="space-y-4">
                    <TextField label="Email" placeholder="Enter your email" icon={<Mail size={16} />} type="email" />
                    <TextField
                      label="Password"
                      placeholder="Enter your password"
                      icon={<Lock size={16} />}
                      type="password"
                    />
                  </div>
                </Card>

                <Card className="p-6 space-y-4">
                  <h4 className="text-lg font-semibold text-success">Contact Form</h4>
                  <div className="space-y-4">
                    <TextField label="Full Name" placeholder="Enter your full name" icon={<User size={16} />} />
                    <TextField
                      label="Email Address"
                      placeholder="Enter your email"
                      icon={<Mail size={16} />}
                      type="email"
                      status="We'll never share your email"
                    />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Dropdown Components */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">
              <span className="text-foreground">4. </span>
              <span className="text-secondary">Dropdowns</span>
            </h1>
            <p className="text-lg text-muted-foreground">Reusable Dropdown Components</p>
          </div>

          <div className="space-y-8">
            {/* Basic Dropdowns */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Basic Dropdowns</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Dropdown label="Basic Dropdown" placeholder="Select an option" options={basicOptions} />
                <Dropdown placeholder="No label dropdown" options={basicOptions} />
              </div>
            </div>

            {/* Variant Styles */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Variant Styles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Dropdown
                  label="Rounded Dropdown"
                  placeholder="Rounded variant"
                  options={basicOptions}
                  variant="rounded"
                />
                <Dropdown
                  label="Rectangular Dropdown"
                  placeholder="Rectangular variant"
                  options={basicOptions}
                  variant="rectangular"
                />
              </div>
            </div>

            {/* With Status Messages */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">With Status Messages</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Dropdown
                  label="Country"
                  placeholder="Select your country"
                  options={countryOptions}
                  status="Choose your primary location"
                />
                <Dropdown
                  label="Status"
                  placeholder="Select status"
                  options={statusOptions}
                  status="Invalid selection"
                  statusType="error"
                />
              </div>
            </div>

            {/* Disabled State */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Disabled State</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Dropdown
                  label="Disabled Dropdown"
                  placeholder="This dropdown is disabled"
                  options={basicOptions}
                  disabled
                />
                <Dropdown
                  label="Disabled with Status"
                  placeholder="Disabled dropdown"
                  options={basicOptions}
                  disabled
                  status="This dropdown is currently disabled"
                />
              </div>
            </div>

            {/* Usage Examples */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Usage Examples</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6 space-y-4">
                  <h4 className="text-lg font-semibold text-primary">User Profile Form</h4>
                  <div className="space-y-4">
                    <TextField label="Full Name" placeholder="Enter your name" icon={<User size={16} />} />
                    <Dropdown
                      label="Country"
                      placeholder="Select your country"
                      options={countryOptions}
                      variant="rounded"
                    />
                    <Dropdown
                      label="Account Status"
                      placeholder="Select status"
                      options={statusOptions}
                      variant="rounded"
                    />
                  </div>
                </Card>

                <Card className="p-6 space-y-4">
                  <h4 className="text-lg font-semibold text-success">Settings Panel</h4>
                  <div className="space-y-4">
                    <TextField label="Email" placeholder="Enter email" icon={<Mail size={16} />} type="email" />
                    <Dropdown
                      label="Notification Preference"
                      placeholder="Select preference"
                      options={[
                        { value: "all", label: "All Notifications" },
                        { value: "important", label: "Important Only" },
                        { value: "none", label: "None" },
                      ]}
                      variant="rectangular"
                      status="Choose how you want to receive notifications"
                    />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Checkbox Components */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">
              <span className="text-foreground">5. </span>
              <span className="text-secondary">Checkboxes</span>
            </h1>
            <p className="text-lg text-muted-foreground">Reusable Checkbox Components</p>
          </div>

          <div className="space-y-8">
            {/* Basic Checkboxes */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Basic Checkboxes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EnhancedCheckbox label="Basic Checkbox" />
                <EnhancedCheckbox label="Pre-checked Checkbox" defaultChecked />
              </div>
            </div>

            {/* Checkbox States */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Different States</h3>
              <div className="space-y-4">
                <EnhancedCheckbox label="Normal Checkbox" />
                <EnhancedCheckbox label="Checked Checkbox" defaultChecked />
                <EnhancedCheckbox label="Disabled Checkbox" disabled />
                <EnhancedCheckbox label="Disabled Checked" disabled defaultChecked />
              </div>
            </div>

            {/* With Descriptions */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">With Descriptions</h3>
              <div className="space-y-4">
                <EnhancedCheckbox
                  label="Terms and Conditions"
                  description="I agree to the terms and conditions and privacy policy"
                  required
                />
                <EnhancedCheckbox
                  label="Newsletter Subscription"
                  description="Receive updates about new features and promotions"
                />
                <EnhancedCheckbox
                  label="Marketing Communications"
                  description="Allow us to send you marketing emails and notifications"
                  defaultChecked
                />
              </div>
            </div>

            {/* Without Labels */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Without Labels</h3>
              <div className="flex gap-4 items-center">
                <EnhancedCheckbox />
                <EnhancedCheckbox defaultChecked />
                <EnhancedCheckbox disabled />
              </div>
            </div>

            {/* Usage Examples */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Usage Examples</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6 space-y-4">
                  <h4 className="text-lg font-semibold text-primary">Registration Form</h4>
                  <div className="space-y-4">
                    <TextField label="Email" placeholder="Enter your email" icon={<Mail size={16} />} type="email" />
                    <TextField
                      label="Password"
                      placeholder="Enter password"
                      icon={<Lock size={16} />}
                      type="password"
                    />
                    <EnhancedCheckbox
                      label="I agree to the Terms of Service"
                      description="By checking this box, you agree to our terms and conditions"
                      required
                    />
                    <EnhancedCheckbox
                      label="Subscribe to newsletter"
                      description="Get updates about new features and promotions"
                    />
                  </div>
                </Card>

                <Card className="p-6 space-y-4">
                  <h4 className="text-lg font-semibold text-success">Preferences Settings</h4>
                  <div className="space-y-4">
                    <EnhancedCheckbox
                      label="Email Notifications"
                      description="Receive notifications via email"
                      defaultChecked
                    />
                    <EnhancedCheckbox
                      label="Push Notifications"
                      description="Receive push notifications on your device"
                    />
                    <EnhancedCheckbox label="SMS Notifications" description="Receive notifications via SMS" disabled />
                    <EnhancedCheckbox
                      label="Marketing Communications"
                      description="Receive promotional emails and offers"
                      defaultChecked
                    />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Radio Button Components */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">
              <span className="text-foreground">6. </span>
              <span className="text-secondary">Radio Buttons</span>
            </h1>
            <p className="text-lg text-muted-foreground">Reusable Radio Button Components</p>
          </div>

          <div className="space-y-8">
            {/* Basic Radio Buttons */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Basic Radio Buttons</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EnhancedRadio label="Gender (Horizontal)" options={genderOptions} orientation="horizontal" />
                <EnhancedRadio
                  label="Notification Method"
                  options={notificationOptions}
                  orientation="horizontal"
                  value="email"
                />
              </div>
            </div>

            {/* Usage Examples */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Usage Examples</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6 space-y-4">
                  <h4 className="text-lg font-semibold text-primary">User Profile Form</h4>
                  <div className="space-y-4">
                    <TextField label="Full Name" placeholder="Enter your name" icon={<User size={16} />} />
                    <TextField label="Email" placeholder="Enter your email" icon={<Mail size={16} />} type="email" />
                    <EnhancedRadio label="Gender" options={genderOptions} orientation="horizontal" />
                    <EnhancedRadio
                      label="Notification Preferences"
                      description="How would you like to receive updates?"
                      options={notificationOptions}
                      value="email"
                    />
                  </div>
                </Card>

                <Card className="p-6 space-y-4">
                  <h4 className="text-lg font-semibold text-success">Subscription Settings</h4>
                  <div className="space-y-4">
                    <EnhancedRadio
                      label="Billing Plan"
                      description="Select your preferred subscription plan"
                      options={planOptions}
                      value="basic"
                      required
                    />
                    <EnhancedCheckbox
                      label="Auto-renewal"
                      description="Automatically renew your subscription"
                      defaultChecked
                    />
                    <EnhancedCheckbox
                      label="Email receipts"
                      description="Send billing receipts to your email"
                      defaultChecked
                    />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Slider Components */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">
              <span className="text-foreground">7. </span>
              <span className="text-secondary">Sliders</span>
            </h1>
            <p className="text-lg text-muted-foreground">Reusable Slider Components</p>
          </div>

          <div className="space-y-8">
            {/* Basic Sliders */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Basic Sliders</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EnhancedSlider label="Basic Slider" variant="single" defaultValue={[30]} />
                <EnhancedSlider variant="single" defaultValue={[50]} />
              </div>
            </div>

            {/* Range Sliders */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Range Sliders</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EnhancedSlider
                  label="Price Range"
                  variant="range"
                  min={240}
                  max={2000}
                  defaultValue={[240, 2000]}
                />
                <EnhancedSlider
                  label="Budget Range"
                  variant="range"
                  min={0}
                  max={100000}
                  defaultValue={[10000, 50000]}
                />
              </div>
            </div>

            {/* With Value Display */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">With Value Display</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EnhancedSlider
                  label="Volume"
                  variant="single"
                  defaultValue={[75]}
                  showValue
                />
                <EnhancedSlider
                  label="Temperature Range"
                  variant="range"
                  min={-10}
                  max={40}
                  defaultValue={[18, 25]}
                  showValue
                />
              </div>
            </div>

            {/* With Descriptions */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">With Descriptions</h3>
              <div className="space-y-6">
                <EnhancedSlider
                  label="Brightness"
                  description="Adjust the screen brightness level"
                  variant="single"
                  defaultValue={[60]}
                  showValue
                />
                <EnhancedSlider
                  label="Age Range"
                  description="Select the age range for your target audience"
                  variant="range"
                  min={18}
                  max={65}
                  defaultValue={[25, 45]}
                  showValue
                />
              </div>
            </div>

            {/* Disabled State */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Disabled State</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EnhancedSlider
                  label="Disabled Single"
                  variant="single"
                  defaultValue={[40]}
                  disabled
                  showValue
                />
                <EnhancedSlider
                  label="Disabled Range"
                  variant="range"
                  defaultValue={[20, 80]}
                  disabled
                  showValue
                />
              </div>
            </div>

            {/* Usage Examples */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Usage Examples</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6 space-y-4">
                  <h4 className="text-lg font-semibold text-primary">E-commerce Filters</h4>
                  <div className="space-y-4">
                    <EnhancedSlider
                      label="Price Range"
                      variant="range"
                      min={0}
                      max={1000}
                      defaultValue={[50, 500]}
                      showValue
                    />
                    <Dropdown
                      label="Category"
                      placeholder="Select category"
                      options={[
                        { value: "electronics", label: "Electronics" },
                        { value: "clothing", label: "Clothing" },
                        { value: "books", label: "Books" },
                      ]}
                    />
                    <EnhancedCheckbox label="Free shipping only" />
                  </div>
                </Card>

                <Card className="p-6 space-y-4">
                  <h4 className="text-lg font-semibold text-success">System Settings</h4>
                  <div className="space-y-4">
                    <EnhancedSlider
                      label="Volume"
                      description="System audio volume level"
                      variant="single"
                      defaultValue={[75]}
                      showValue
                    />
                    <EnhancedSlider
                      label="Brightness"
                      description="Screen brightness level"
                      variant="single"
                      defaultValue={[60]}
                      showValue
                    />
                    <EnhancedCheckbox label="Auto-adjust brightness" defaultChecked />
                    <EnhancedCheckbox label="Mute notifications" />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Breadcrumb Components */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">
              <span className="text-foreground">8. </span>
              <span className="text-secondary">Breadcrumbs</span>
            </h1>
            <p className="text-lg text-muted-foreground">Navigation Breadcrumb Components</p>
          </div>

          <div className="space-y-8">
            {/* Basic Breadcrumbs */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Basic Breadcrumbs</h3>
              <div className="space-y-4">
                <SimpleBreadcrumb path={["Home", "Detail", "Pricing"]} />
                <SimpleBreadcrumb path={["Dashboard", "Settings", "Profile"]} />
              </div>
            </div>

            {/* Without Home Icon */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Without Home Icon</h3>
              <div className="space-y-4">
                <SimpleBreadcrumb path={["Home", "Products", "Electronics"]} homeIcon={false} />
                <SimpleBreadcrumb path={["Admin", "Users", "Permissions"]} homeIcon={false} />
              </div>
            </div>

            {/* Custom Breadcrumbs with Icons */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Custom Breadcrumbs with Icons</h3>
              <div className="space-y-4">
                <EnhancedBreadcrumb
                  items={[
                    { label: "Home", href: "/" },
                    { label: "Settings", href: "/settings", icon: <Settings className="w-4 h-4" /> },
                    { label: "Profile" },
                  ]}
                />
                <EnhancedBreadcrumb
                  items={[
                    { label: "Home", href: "/" },
                    { label: "Shop", href: "/shop", icon: <ShoppingCart className="w-4 h-4" /> },
                    { label: "Electronics", href: "/shop/electronics" },
                    { label: "Laptops" },
                  ]}
                />
              </div>
            </div>

            {/* Long Breadcrumb Paths */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Long Breadcrumb Paths</h3>
              <div className="space-y-4">
                <SimpleBreadcrumb
                  path={["Home", "Categories", "Electronics", "Computers", "Laptops", "Gaming", "Product Details"]}
                />
                <EnhancedBreadcrumb
                  items={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Projects", href: "/projects" },
                    { label: "Web Development", href: "/projects/web" },
                    { label: "E-commerce", href: "/projects/web/ecommerce" },
                    { label: "Product Catalog", href: "/projects/web/ecommerce/catalog" },
                    { label: "Item Details" },
                  ]}
                />
              </div>
            </div>

            {/* Usage Examples */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Usage Examples</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6 space-y-4">
                  <h4 className="text-lg font-semibold text-primary">E-commerce Navigation</h4>
                  <div className="space-y-4">
                    <SimpleBreadcrumb path={["Home", "Electronics", "Smartphones", "iPhone 15"]} />
                    <div className="border-t pt-4">
                      <h5 className="font-medium mb-2">Product Details</h5>
                      <p className="text-sm text-muted-foreground">
                        Navigate through product categories with clear breadcrumb trails
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 space-y-4">
                  <h4 className="text-lg font-semibold text-success">Admin Dashboard</h4>
                  <div className="space-y-4">
                    <EnhancedBreadcrumb
                      items={[
                        { label: "Dashboard", href: "/admin" },
                        { label: "Users", href: "/admin/users", icon: <User className="w-4 h-4" /> },
                        { label: "User Profile" },
                      ]}
                    />
                    <div className="border-t pt-4">
                      <h5 className="font-medium mb-2">User Management</h5>
                      <p className="text-sm text-muted-foreground">
                        Admin interface with contextual navigation and icons
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Implementation Examples */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Implementation Examples</h3>
              <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                <h4 className="font-semibold text-foreground">Simple Usage:</h4>
                <pre className="text-sm bg-background p-4 rounded border overflow-x-auto">
                  <code>{`<SimpleBreadcrumb path={["Home", "Products", "Details"]} />`}</code>
                </pre>

                <h4 className="font-semibold text-foreground">Advanced Usage:</h4>
                <pre className="text-sm bg-background p-4 rounded border overflow-x-auto">
                  <code>{`<EnhancedBreadcrumb
  items={[
    { label: "Home", href: "/" },
    { label: "Settings", href: "/settings", icon: <Settings /> },
    { label: "Profile" }
  ]}
/>`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Button Components */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">
              <span className="text-foreground">9. </span>
              <span className="text-secondary">Buttons</span>
            </h1>
            <p className="text-lg text-muted-foreground">Reusable Button Components</p>
          </div>

          <div className="space-y-8">
            {/* Button Variants */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Button Variants</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6 space-y-4">
                  <h4 className="font-semibold text-foreground">Default</h4>
                  <div className="space-y-3">
                    <Button variant="default">Button Text</Button>
                    <Button variant="default" disabled>
                      Disabled
                    </Button>
                  </div>
                </Card>

                <Card className="p-6 space-y-4">
                  <h4 className="font-semibold text-foreground">Primary</h4>
                  <div className="space-y-3">
                    <Button variant="primary">Button Text</Button>
                    <Button variant="primary" disabled>
                      Disabled
                    </Button>
                  </div>
                </Card>

                <Card className="p-6 space-y-4">
                  <h4 className="font-semibold text-foreground">Secondary</h4>
                  <div className="space-y-3">
                    <Button variant="secondary">Button Text</Button>
                    <Button variant="secondary" disabled>
                      Disabled
                    </Button>
                  </div>
                </Card>

                <Card className="p-6 space-y-4">
                  <h4 className="font-semibold text-foreground">Tertiary</h4>
                  <div className="space-y-3">
                    <Button variant="tertiary">Button Text</Button>
                    <Button variant="tertiary" disabled>
                      Disabled
                    </Button>
                  </div>
                </Card>

                <Card className="p-6 space-y-4">
                  <h4 className="font-semibold text-foreground">Gradient</h4>
                  <div className="space-y-3">
                    <Button variant="gradient">Button Text</Button>
                    <Button variant="gradient" disabled>
                      Disabled
                    </Button>
                  </div>
                </Card>

                <Card className="p-6 space-y-4">
                  <h4 className="font-semibold text-foreground">Outline</h4>
                  <div className="space-y-3">
                    <Button variant="outline">Button Text</Button>
                    <Button variant="outline" disabled>
                      Disabled
                    </Button>
                  </div>
                </Card>
              </div>
            </div>

            {/* Button Sizes */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Button Sizes</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="primary" size="sm">
                  Small
                </Button>
                <Button variant="primary" size="default">
                  Default
                </Button>
                <Button variant="primary" size="lg">
                  Large
                </Button>
              </div>
            </div>

            {/* Buttons with Icons */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Buttons with Icons</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6 space-y-4">
                  <h4 className="font-semibold text-foreground">Icon Left</h4>
                  <div className="space-y-3">
                    <Button variant="primary">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="secondary">
                      <Heart className="w-4 h-4 mr-2" />
                      Like
                    </Button>
                  </div>
                </Card>

                <Card className="p-6 space-y-4">
                  <h4 className="font-semibold text-foreground">Icon Right</h4>
                  <div className="space-y-3">
                    <Button variant="primary">
                      Continue
                      <Star className="w-4 h-4 ml-2" />
                    </Button>
                    <Button variant="tertiary">
                      Settings
                      <Settings className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>

                <Card className="p-6 space-y-4">
                  <h4 className="font-semibold text-foreground">Icon Only</h4>
                  <div className="space-y-3">
                    <Button variant="primary" size="icon">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="secondary" size="icon">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </div>
            </div>

            {/* Interactive States */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Interactive States</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6 space-y-4">
                  <h4 className="font-semibold text-foreground">Default State</h4>
                  <Button variant="primary">Hover Me</Button>
                </Card>

                <Card className="p-6 space-y-4">
                  <h4 className="font-semibold text-foreground">Loading State</h4>
                  <Button variant="primary" disabled>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Loading...
                  </Button>
                </Card>

                <Card className="p-6 space-y-4">
                  <h4 className="font-semibold text-foreground">Disabled State</h4>
                  <Button variant="primary" disabled>
                    Disabled
                  </Button>
                </Card>

                <Card className="p-6 space-y-4">
                  <h4 className="font-semibold text-foreground">Gradient Animation</h4>
                  <Button variant="gradient">Animated</Button>
                </Card>
              </div>
            </div>

            {/* Usage Examples */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Usage Examples</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6 space-y-4">
                  <h4 className="text-lg font-semibold text-primary">Call-to-Action Section</h4>
                  <div className="space-y-4">
                    <Button variant="primary" size="lg" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Get Started Now
                    </Button>
                    <div className="flex gap-3">
                      <Button variant="secondary" className="flex-1">
                        Learn More
                      </Button>
                      <Button variant="tertiary" className="flex-1">
                        Watch Demo
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 space-y-4">
                  <h4 className="text-lg font-semibold text-success">Action Buttons</h4>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Button variant="primary">
                        <Heart className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="secondary">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                    <Button variant="gradient" className="w-full">
                      <Star className="w-4 h-4 mr-2" />
                      Premium Upgrade
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Product Card and Slider Components */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">
              <span className="text-foreground">10. </span>
              <span className="text-secondary">Product Cards & Sliders</span>
            </h1>
            <p className="text-lg text-muted-foreground">Interactive Product Card Components with Slider</p>
          </div>

          <div className="space-y-8">
            {/* Individual Product Cards */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Individual Product Cards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ProductCard
                  id="demo-1"
                  title="Scientific Center"
                  subtitle="Popular with families this week"
                  image="/placeholder.svg?height=200&width=300"
                  category="Landmarks"
                  rating={4.8}
                  reviewCount={423}
                  distance="4.2 km"
                  price="$"
                />
                <ProductCard
                  id="demo-2"
                  title="Souq Al-Mubarakiya"
                  subtitle="Trending for authentic shopping"
                  image="/placeholder.svg?height=200&width=300"
                  category="Shopping"
                  rating={4.4}
                  reviewCount={568}
                  distance="1.8 km"
                  isFree={true}
                  badge="sponsored"
                />
                <ProductCard
                  id="demo-3"
                  title="Marina Beach"
                  subtitle="Perfect weather this week"
                  image="/placeholder.svg?height=200&width=300"
                  category="Beach"
                  rating={4.3}
                  reviewCount={234}
                  distance="6.7 km"
                  isFree={true}
                  badge="trending"
                />
              </div>
            </div>

            {/* Card Slider */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Card Slider</h3>
              <CardSlider
                title="Featured in Explore"
                subtitle="Discover Kuwait's most popular spots with exclusive deals"
                cards={sampleProducts}
                showViewAll={true}
                showDots={true}
                autoPlay={false}
              />
            </div>

            {/* Auto-play Slider */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Auto-play Slider</h3>
              <CardSlider
                title="Trending Now"
                subtitle="Popular destinations updated every hour"
                cards={sampleProducts.slice(0, 4)}
                autoPlay={true}
                autoPlayInterval={3000}
                showDots={true}
              />
            </div>

            {/* Different Categories */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Different Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ProductCard
                  id="cat-1"
                  title="Restaurant"
                  subtitle="Fine dining experience"
                  image="/placeholder.svg?height=200&width=300"
                  category="Dining"
                  rating={4.7}
                  reviewCount={156}
                  distance="2.1 km"
                  price="$"
                />
                <ProductCard
                  id="cat-2"
                  title="Adventure Park"
                  subtitle="Thrilling outdoor activities"
                  image="/placeholder.svg?height=200&width=300"
                  category="Entertainment"
                  rating={4.5}
                  reviewCount={89}
                  distance="12.3 km"
                  price="$$"
                  badge="trending"
                />
                <ProductCard
                  id="cat-3"
                  title="Art Gallery"
                  subtitle="Contemporary art exhibitions"
                  image="/placeholder.svg?height=200&width=300"
                  category="Culture"
                  rating={4.2}
                  reviewCount={67}
                  distance="5.8 km"
                  isFree={true}
                />
                <ProductCard
                  id="cat-4"
                  title="Spa & Wellness"
                  subtitle="Relaxation and rejuvenation"
                  image="/placeholder.svg?height=200&width=300"
                  category="Wellness"
                  rating={4.9}
                  reviewCount={234}
                  distance="3.7 km"
                  price="$$"
                  badge="sponsored"
                />
              </div>
            </div>
            </div>
</section>
      </div>
    </div>
  )
}
