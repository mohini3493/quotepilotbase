"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  DoorOpen,
  Loader2,
  MapPin,
  Palette,
  Ruler,
  Grip,
  PanelTop,
  PaintBucket,
  ShoppingBag,
  Users,
} from "lucide-react";

type DoorType = {
  id: number;
  name: string;
  slug: string;
  image: string;
  description?: string;
};

type PanelStyle = {
  id: number;
  name: string;
  slug: string;
  image: string;
  description?: string;
};

type Dimension = {
  id: number;
  width: number;
  height: number;
};

type Postcode = {
  id: number;
  code: string;
};

type ExternalColor = {
  id: number;
  name: string;
  slug: string;
  colorCode: string;
  image: string;
  description?: string;
};

type InternalColor = {
  id: number;
  name: string;
  slug: string;
  colorCode: string;
  image: string;
  description?: string;
};

type HandleColor = {
  id: number;
  name: string;
  slug: string;
  colorCode: string;
  image: string;
  description?: string;
};

type Selection = {
  doorType: DoorType | null;
  panelStyle: PanelStyle | null;
  dimension: Dimension | null;
  postcode: Postcode | null;
  externalColor: ExternalColor | null;
  internalColor: InternalColor | null;
  handleColor: HandleColor | null;
};

const STEPS = [
  { id: 1, title: "Door Type", description: "Choose your door type" },
  { id: 2, title: "Panel Style", description: "Select panel style" },
  { id: 3, title: "Dimensions", description: "Pick dimensions" },
  { id: 4, title: "Postcode", description: "Your location" },
  { id: 5, title: "External Color", description: "Outside finish" },
  { id: 6, title: "Internal Color", description: "Inside finish" },
  { id: 7, title: "Handle Color", description: "Handle finish" },
  { id: 8, title: "Summary", description: "Review & Submit" },
];

type ProductConfiguratorProps = {
  productId?: number;
  productTitle?: string;
};

export default function ProductConfigurator({
  productId,
  productTitle,
}: ProductConfiguratorProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selection, setSelection] = useState<Selection>({
    doorType: null,
    panelStyle: null,
    dimension: null,
    postcode: null,
    externalColor: null,
    internalColor: null,
    handleColor: null,
  });

  const [doorTypes, setDoorTypes] = useState<DoorType[]>([]);
  const [panelStyles, setPanelStyles] = useState<PanelStyle[]>([]);
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const [postcodes, setPostcodes] = useState<Postcode[]>([]);
  const [externalColors, setExternalColors] = useState<ExternalColor[]>([]);
  const [internalColors, setInternalColors] = useState<InternalColor[]>([]);
  const [handleColors, setHandleColors] = useState<HandleColor[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [contactDetails, setContactDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [
          doorTypesRes,
          panelStylesRes,
          dimensionsRes,
          postcodesRes,
          externalColorsRes,
          internalColorsRes,
          handleColorsRes,
        ] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/door-types`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/panel-styles`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dimensions`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/postcodes`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/external-colors`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/internal-colors`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/handle-colors`),
        ]);

        if (doorTypesRes.ok) {
          const data = await doorTypesRes.json();
          setDoorTypes(Array.isArray(data) ? data : data.data || []);
        }
        if (panelStylesRes.ok) {
          const data = await panelStylesRes.json();
          setPanelStyles(Array.isArray(data) ? data : data.data || []);
        }
        if (dimensionsRes.ok) {
          const data = await dimensionsRes.json();
          setDimensions(Array.isArray(data) ? data : data.data || []);
        }
        if (postcodesRes.ok) {
          const data = await postcodesRes.json();
          setPostcodes(Array.isArray(data) ? data : data.data || []);
        }
        if (externalColorsRes.ok) {
          const data = await externalColorsRes.json();
          setExternalColors(Array.isArray(data) ? data : data.data || []);
        }
        if (internalColorsRes.ok) {
          const data = await internalColorsRes.json();
          setInternalColors(Array.isArray(data) ? data : data.data || []);
        }
        if (handleColorsRes.ok) {
          const data = await handleColorsRes.json();
          setHandleColors(Array.isArray(data) ? data : data.data || []);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selection.doorType !== null;
      case 2:
        return selection.panelStyle !== null;
      case 3:
        return selection.dimension !== null;
      case 4:
        return selection.postcode !== null;
      case 5:
        return selection.externalColor !== null;
      case 6:
        return selection.internalColor !== null;
      case 7:
        return selection.handleColor !== null;
      default:
        return true;
    }
  };

  const handleSubmitQuote = async () => {
    setSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/customers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: contactDetails.name,
            email: contactDetails.email,
            phone: contactDetails.phone,
            productId: productId,
            productTitle: productTitle,
            doorTypeId: selection.doorType?.id,
            doorTypeName: selection.doorType?.name,
            panelStyleId: selection.panelStyle?.id,
            panelStyleName: selection.panelStyle?.name,
            dimensionId: selection.dimension?.id,
            dimensionWidth: selection.dimension?.width,
            dimensionHeight: selection.dimension?.height,
            postcodeId: selection.postcode?.id,
            postcodeCode: selection.postcode?.code,
            externalColorId: selection.externalColor?.id,
            externalColorName: selection.externalColor?.name,
            internalColorId: selection.internalColor?.id,
            internalColorName: selection.internalColor?.name,
            handleColorId: selection.handleColor?.id,
            handleColorName: selection.handleColor?.name,
          }),
        },
      );

      if (response.ok) {
        setSubmitted(true);
      } else {
        console.error("Failed to submit quote");
      }
    } catch (error) {
      console.error("Error submitting quote:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    // Allow going back to previous steps or current step
    if (step <= currentStep) {
      setCurrentStep(step);
    }
    // Allow going forward only if all previous steps are complete
    else if (step === 2 && selection.doorType) {
      setCurrentStep(step);
    } else if (step === 3 && selection.doorType && selection.panelStyle) {
      setCurrentStep(step);
    } else if (
      step === 4 &&
      selection.doorType &&
      selection.panelStyle &&
      selection.dimension
    ) {
      setCurrentStep(step);
    } else if (
      step === 5 &&
      selection.doorType &&
      selection.panelStyle &&
      selection.dimension &&
      selection.postcode
    ) {
      setCurrentStep(step);
    } else if (
      step === 6 &&
      selection.doorType &&
      selection.panelStyle &&
      selection.dimension &&
      selection.postcode &&
      selection.externalColor
    ) {
      setCurrentStep(step);
    } else if (
      step === 7 &&
      selection.doorType &&
      selection.panelStyle &&
      selection.dimension &&
      selection.postcode &&
      selection.externalColor &&
      selection.internalColor
    ) {
      setCurrentStep(step);
    } else if (
      step === 8 &&
      selection.doorType &&
      selection.panelStyle &&
      selection.dimension &&
      selection.postcode &&
      selection.externalColor &&
      selection.internalColor &&
      selection.handleColor
    ) {
      setCurrentStep(step);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Step Indicator */}
      <div className="mb-10">
        {/* Desktop Step Indicator - Full Width */}
        <div className="hidden lg:grid grid-cols-8 gap-1 bg-gray-100 rounded-2xl p-2">
          {STEPS.map((step) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-xl transition-all",
                currentStep === step.id
                  ? "bg-white shadow-lg text-primary"
                  : step.id < currentStep
                    ? "text-primary hover:bg-white/60 cursor-pointer"
                    : "text-gray-400 hover:bg-white/30",
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold transition-all",
                  currentStep === step.id
                    ? "bg-primary text-white shadow-lg shadow-primary/40"
                    : step.id < currentStep
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-400",
                )}
              >
                {step.id < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              <span className="text-xs font-semibold text-center leading-tight">
                {step.title}
              </span>
            </button>
          ))}
        </div>

        {/* Tablet/Mobile Step Indicator */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm">
                {currentStep}
              </div>
              <span className="font-semibold text-gray-900">
                {STEPS[currentStep - 1].title}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {currentStep} / {STEPS.length}
            </span>
          </div>
          <div className="flex gap-1.5">
            {STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                className={cn(
                  "flex-1 h-2.5 rounded-full transition-all",
                  step.id <= currentStep ? "bg-primary" : "bg-gray-200",
                  step.id === currentStep &&
                    "bg-primary shadow-sm shadow-primary/50",
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {/* Step 1: Door Types */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Choose Your Door Type</h2>
              <p className="text-muted-foreground mt-2">
                Select the type of door that best fits your needs
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {doorTypes.map((doorType) => (
                <Card
                  key={doorType.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-lg overflow-hidden",
                    selection.doorType?.id === doorType.id
                      ? "ring-2 ring-primary shadow-lg"
                      : "hover:ring-1 hover:ring-primary/50",
                  )}
                  onClick={() =>
                    setSelection({ ...selection, doorType: doorType })
                  }
                >
                  <div className="relative">
                    <img
                      src={doorType.image || "/placeholder.jpg"}
                      alt={doorType.name}
                      className="w-full h-full object-cover"
                    />
                    {selection.doorType?.id === doorType.id && (
                      <div className="absolute top-3 right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg">{doorType.name}</h3>
                    {doorType.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {doorType.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            {doorTypes.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No door types available
              </div>
            )}
          </div>
        )}

        {/* Step 2: Panel Styles */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Select Panel Style</h2>
              <p className="text-muted-foreground mt-2">
                Choose the panel style that matches your preference
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {panelStyles.map((panelStyle) => (
                <Card
                  key={panelStyle.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-lg overflow-hidden",
                    selection.panelStyle?.id === panelStyle.id
                      ? "ring-2 ring-primary shadow-lg"
                      : "hover:ring-1 hover:ring-primary/50",
                  )}
                  onClick={() =>
                    setSelection({ ...selection, panelStyle: panelStyle })
                  }
                >
                  <div className="relative">
                    <img
                      src={panelStyle.image || "/placeholder.jpg"}
                      alt={panelStyle.name}
                      className="w-full h-full object-cover"
                    />
                    {selection.panelStyle?.id === panelStyle.id && (
                      <div className="absolute top-3 right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg">{panelStyle.name}</h3>
                    {panelStyle.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {panelStyle.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            {panelStyles.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No panel styles available
              </div>
            )}
          </div>
        )}

        {/* Step 3: Dimensions */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Pick Dimensions</h2>
              <p className="text-muted-foreground mt-2">
                Select the dimensions that fit your space
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {dimensions.map((dimension) => (
                <Card
                  key={dimension.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-lg overflow-hidden",
                    selection.dimension?.id === dimension.id
                      ? "ring-2 ring-primary shadow-lg bg-primary/5"
                      : "hover:ring-1 hover:ring-primary/50",
                  )}
                  onClick={() =>
                    setSelection({ ...selection, dimension: dimension })
                  }
                >
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                      <svg
                        className="w-8 h-8 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                        />
                      </svg>
                    </div>
                    <h3 className="font-bold text-lg text-foreground">
                      {dimension.width} x {dimension.height}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">mm</p>
                    {selection.dimension?.id === dimension.id && (
                      <div className="mt-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            {dimensions.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No dimensions available
              </div>
            )}
          </div>
        )}

        {/* Step 4: Postcodes */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Enter Your Postcode</h2>
              <p className="text-muted-foreground mt-2">
                Select your delivery/installation area
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {postcodes.map((postcode) => (
                <Card
                  key={postcode.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-lg",
                    selection.postcode?.id === postcode.id
                      ? "ring-2 ring-primary shadow-lg bg-primary/5"
                      : "hover:ring-1 hover:ring-primary/50",
                  )}
                  onClick={() =>
                    setSelection({ ...selection, postcode: postcode })
                  }
                >
                  <CardContent className="flex items-center justify-center gap-2">
                    <h3 className="font-bold text-lg flex items-center justify-center gap-2">
                      <MapPin className="w-5 h-5 flex-shrink-0" />
                      {postcode.code}
                    </h3>
                    {selection.postcode?.id === postcode.id && (
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            {postcodes.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No postcodes available
              </div>
            )}
          </div>
        )}

        {/* Step 5: External Colors */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Choose External Color</h2>
              <p className="text-muted-foreground mt-2">
                Select the outside finish for your door
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-4">
              {externalColors.map((color) => (
                <Card
                  key={color.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-lg overflow-hidden",
                    selection.externalColor?.id === color.id
                      ? "ring-2 ring-primary shadow-lg"
                      : "hover:ring-1 hover:ring-primary/50",
                  )}
                  onClick={() =>
                    setSelection({ ...selection, externalColor: color })
                  }
                >
                  <div className="relative aspect-square">
                    {color.image ? (
                      <img
                        src={color.image}
                        alt={color.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full"
                        style={{ backgroundColor: color.colorCode || "#ccc" }}
                      />
                    )}
                    {selection.externalColor?.id === color.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium text-sm text-center">
                      {color.name}
                    </h3>
                  </CardContent>
                </Card>
              ))}
            </div>
            {externalColors.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No external colors available
              </div>
            )}
          </div>
        )}

        {/* Step 6: Internal Colors */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Choose Internal Color</h2>
              <p className="text-muted-foreground mt-2">
                Select the inside finish for your door
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-4">
              {internalColors.map((color) => (
                <Card
                  key={color.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-lg overflow-hidden",
                    selection.internalColor?.id === color.id
                      ? "ring-2 ring-primary shadow-lg"
                      : "hover:ring-1 hover:ring-primary/50",
                  )}
                  onClick={() =>
                    setSelection({ ...selection, internalColor: color })
                  }
                >
                  <div className="relative aspect-square">
                    {color.image ? (
                      <img
                        src={color.image}
                        alt={color.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full"
                        style={{ backgroundColor: color.colorCode || "#ccc" }}
                      />
                    )}
                    {selection.internalColor?.id === color.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium text-sm text-center">
                      {color.name}
                    </h3>
                  </CardContent>
                </Card>
              ))}
            </div>
            {internalColors.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No internal colors available
              </div>
            )}
          </div>
        )}

        {/* Step 7: Handle Colors */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Choose Handle Color</h2>
              <p className="text-muted-foreground mt-2">
                Select the handle finish for your door
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-4">
              {handleColors.map((color) => (
                <Card
                  key={color.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-lg overflow-hidden",
                    selection.handleColor?.id === color.id
                      ? "ring-2 ring-primary shadow-lg"
                      : "hover:ring-1 hover:ring-primary/50",
                  )}
                  onClick={() =>
                    setSelection({ ...selection, handleColor: color })
                  }
                >
                  <div className="relative aspect-square">
                    {color.image ? (
                      <img
                        src={color.image}
                        alt={color.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full"
                        style={{ backgroundColor: color.colorCode || "#ccc" }}
                      />
                    )}
                    {selection.handleColor?.id === color.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium text-sm text-center">
                      {color.name}
                    </h3>
                  </CardContent>
                </Card>
              ))}
            </div>
            {handleColors.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No handle colors available
              </div>
            )}
          </div>
        )}

        {/* Step 8: Summary with Contact Details */}
        {currentStep === 8 && (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-3">
              <div className="px-2">
                <h2 className="text-xl sm:text-2xl font-bold mb-3">
                  Review Your Selection
                </h2>

                <Card>
                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
                    {selection.panelStyle && (
                      <>
                        <img
                          src={selection.panelStyle.image || "/placeholder.jpg"}
                          alt={selection.panelStyle.name}
                          className="w-full h-full object-cover"
                        />
                      </>
                    )}
                    <div>
                      <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
                        Here's a summary of your configuration
                      </p>
                      <ul>
                        <li className="flex items-center gap-2 mt-3">
                          <h3 className="font-semibold text-primary text-[10px] sm:text-xs truncate flex items-center gap-1">
                            <DoorOpen className="w-5 h-5 flex-shrink-0" />
                            Door Type
                          </h3>{" "}
                          -
                          {selection.doorType && (
                            <p className="font-medium text-[10px] sm:text-xs truncate">
                              {selection.doorType.name}
                            </p>
                          )}
                        </li>
                        <li className="flex items-center gap-2 mt-3">
                          <h3 className="font-semibold text-primary text-[10px] sm:text-xs truncate flex items-center gap-1">
                            <PanelTop className="w-5 h-5 flex-shrink-0" />
                            Panel Style
                          </h3>{" "}
                          -
                          {selection.panelStyle && (
                            <p className="font-medium text-[10px] sm:text-xs truncate">
                              {selection.panelStyle.name}
                            </p>
                          )}
                        </li>
                        <li className="flex items-center gap-2 mt-3">
                          <h3 className="font-semibold text-primary text-[10px] sm:text-xs truncate flex items-center gap-1">
                            <Ruler className="w-5 h-5 flex-shrink-0" />
                            Dimensions
                          </h3>{" "}
                          -
                          {selection.dimension && (
                            <>
                              <p className="font-medium text-[10px] sm:text-xs truncate">
                                {selection.dimension.width} x{" "}
                                {selection.dimension.height}
                              </p>
                              <p className="text-[10px] sm:text-xs text-muted-foreground">
                                mm
                              </p>
                            </>
                          )}
                        </li>
                        <li className="flex items-center gap-2 mt-3">
                          <h3 className="font-semibold text-primary text-[10px] sm:text-xs truncate flex items-center gap-1">
                            <MapPin className="w-5 h-5 flex-shrink-0" />
                            Postcodes
                          </h3>{" "}
                          -
                          {selection.postcode && (
                            <p className="font-medium text-[10px] sm:text-xs truncate">
                              {selection.postcode.code}
                            </p>
                          )}
                        </li>
                        <li className="flex items-center gap-2 mt-3">
                          <h3 className="font-semibold text-primary text-[10px] sm:text-xs truncate flex items-center gap-1">
                            <Palette className="w-5 h-5 flex-shrink-0" />
                            External Colors
                          </h3>{" "}
                          -
                          {selection.externalColor && (
                            <p className="font-medium text-[10px] sm:text-xs text-center truncate">
                              {selection.externalColor.name}
                            </p>
                          )}
                        </li>
                        <li className="flex items-center gap-2 mt-3">
                          <h3 className="font-semibold text-primary text-[10px] sm:text-xs truncate flex items-center gap-1">
                            <PaintBucket className="w-5 h-5 flex-shrink-0" />
                            Internal Colors
                          </h3>{" "}
                          -
                          {selection.internalColor && (
                            <p className="font-medium text-[10px] sm:text-xs text-center truncate">
                              {selection.internalColor.name}
                            </p>
                          )}
                        </li>
                        <li className="flex items-center gap-2 mt-3">
                          <h3 className="font-semibold text-primary text-[10px] sm:text-xs truncate flex items-center gap-1">
                            <Grip className="w-5 h-5 flex-shrink-0" />
                            Handle Colors
                          </h3>{" "}
                          -
                          {selection.handleColor && (
                            <p className="font-medium text-[10px] sm:text-xs text-center truncate">
                              {selection.handleColor.name}
                            </p>
                          )}
                        </li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Contact Details Form */}
              {!submitted && (
                <div className="mt-6 sm:mt-8">
                  <div className="mb-3 sm:mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold">
                      Enter Your Contact Details
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Fill in your details to receive your quote
                    </p>
                  </div>
                  <div className="mx-auto space-y-3 sm:space-y-4 px-2 sm:px-0">
                    <div className="space-y-1.5 sm:space-y-2">
                      <label
                        htmlFor="name"
                        className="text-xs sm:text-sm font-medium"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={contactDetails.name}
                        onChange={(e) =>
                          setContactDetails({
                            ...contactDetails,
                            name: e.target.value,
                          })
                        }
                        className="h-9 sm:h-10 text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-1.5 sm:space-y-2">
                      <label
                        htmlFor="email"
                        className="text-xs sm:text-sm font-medium"
                      >
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={contactDetails.email}
                        onChange={(e) =>
                          setContactDetails({
                            ...contactDetails,
                            email: e.target.value,
                          })
                        }
                        className="h-9 sm:h-10 text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-1.5 sm:space-y-2">
                      <label
                        htmlFor="phone"
                        className="text-xs sm:text-sm font-medium"
                      >
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={contactDetails.phone}
                        onChange={(e) =>
                          setContactDetails({
                            ...contactDetails,
                            phone: e.target.value,
                          })
                        }
                        className="h-9 sm:h-10 text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center pt-4 sm:pt-6">
              {submitted ? (
                <div className="text-center space-y-3 sm:space-y-4 px-4">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-6 sm:w-8 h-6 sm:h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-green-600">
                      Quote Submitted!
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground mt-2">
                      Thank you, {contactDetails.name}! We'll contact you soon
                      at {contactDetails.email}.
                    </p>
                  </div>
                </div>
              ) : (
                <Button
                  size="lg"
                  className="px-6 sm:px-8 h-10 sm:h-11"
                  onClick={handleSubmitQuote}
                  disabled={
                    submitting ||
                    !contactDetails.name.trim() ||
                    !contactDetails.email.trim() ||
                    !contactDetails.phone.trim()
                  }
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Get Quote"
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1 || submitted}
          className="gap-1 sm:gap-2 h-9 sm:h-10 px-3 sm:px-4"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </Button>

        <div className="flex items-center gap-2">
          {currentStep < 8 && (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="gap-1 sm:gap-2 h-9 sm:h-10 px-3 sm:px-4"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
