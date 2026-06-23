"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  ClipboardList,
  Layers,
  Plus,
  Trash2,
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

type GlazingOption = {
  id: number;
  name: string;
  slug: string;
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
  glazingOption: GlazingOption | null;
  handleColor: HandleColor | null;
};

type SavedProduct = {
  productId?: number;
  productTitle?: string;
  selection: Selection;
};

const STEP_ICONS = [
  DoorOpen,
  PanelTop,
  Ruler,
  MapPin,
  Palette,
  PaintBucket,
  Layers,
  Grip,
  ClipboardList,
];

const STEPS = [
  { id: 1, title: "Product Type", description: "Choose your product type" },
  { id: 2, title: "Panel Style", description: "Select panel style" },
  { id: 3, title: "Dimensions", description: "Pick dimensions" },
  { id: 4, title: "Postcode", description: "Your location" },
  { id: 5, title: "External Color", description: "Outside finish" },
  { id: 6, title: "Internal Color", description: "Inside finish" },
  { id: 7, title: "Glazing", description: "Glazing option" },
  { id: 8, title: "Handle Color", description: "Handle finish" },
  { id: 9, title: "Summary", description: "Review & Submit" },
];

type ProductConfiguratorProps = {
  productId?: number;
  productTitle?: string;
};

export default function ProductConfigurator({
  productId,
  productTitle,
}: ProductConfiguratorProps) {
  // Pagination state for each paginated step
  const [doorTypePage, setDoorTypePage] = useState(1);
  const [panelStylePage, setPanelStylePage] = useState(1);
  const [externalColorPage, setExternalColorPage] = useState(1);
  const [internalColorPage, setInternalColorPage] = useState(1);
  const [glazingOptionPage, setGlazingOptionPage] = useState(1);
  const [handleColorPage, setHandleColorPage] = useState(1);
  const CARDS_PER_PAGE = 12;
  const [currentStep, setCurrentStep] = useState(1);
  const [selection, setSelection] = useState<Selection>({
    doorType: null,
    panelStyle: null,
    dimension: null,
    postcode: null,
    externalColor: null,
    internalColor: null,
    glazingOption: null,
    handleColor: null,
  });

  const [doorTypes, setDoorTypes] = useState<DoorType[]>([]);
  const [panelStyles, setPanelStyles] = useState<PanelStyle[]>([]);
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const [postcodes, setPostcodes] = useState<Postcode[]>([]);
  const [externalColors, setExternalColors] = useState<ExternalColor[]>([]);
  const [internalColors, setInternalColors] = useState<InternalColor[]>([]);
  const [glazingOptions, setGlazingOptions] = useState<GlazingOption[]>([]);
  const [handleColors, setHandleColors] = useState<HandleColor[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [savedProducts, setSavedProducts] = useState<SavedProduct[]>([]);
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
          glazingOptionsRes,
          handleColorsRes,
        ] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/door-types${productId ? `?product_id=${productId}` : ""}`,
          ),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/panel-styles`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dimensions`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/postcodes`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/external-colors`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/internal-colors`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/glazing-options`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/handle-colors${productId ? `?product_id=${productId}` : ""}`),
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
        if (glazingOptionsRes.ok) {
          const data = await glazingOptionsRes.json();
          setGlazingOptions(Array.isArray(data) ? data : data.data || []);
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

  // Reload panel styles when door type changes
  useEffect(() => {
    if (!selection.doorType) return;
    const doorTypeId = selection.doorType.id;
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/panel-styles?door_type_id=${doorTypeId}`,
    )
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const arr = Array.isArray(data) ? data : data.data || [];
        setPanelStyles(arr);
        // Clear panel style selection if it no longer matches
        if (
          selection.panelStyle &&
          !arr.some((s: PanelStyle) => s.id === selection.panelStyle?.id)
        ) {
          setSelection((prev) => ({ ...prev, panelStyle: null }));
        }
        // Auto-advance: skip to Step 3 if no panel styles, otherwise go to Step 2
        setCurrentStep((s) => {
          if (s <= 2) return arr.length === 0 ? 3 : 2;
          return s;
        });
      })
      .catch(() => {});
  }, [selection.doorType]);

  const skipPanelStep = panelStyles.length === 0 && selection.doorType !== null;

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selection.doorType !== null;
      case 2:
        return skipPanelStep || selection.panelStyle !== null;
      case 3:
        return selection.dimension !== null;
      case 4:
        return selection.postcode !== null;
      case 5:
        return selection.externalColor !== null;
      case 6:
        return selection.internalColor !== null;
      case 7:
        return selection.glazingOption !== null;
      case 8:
        return selection.handleColor !== null;
      default:
        return true;
    }
  };

  const emptySelection: Selection = {
    doorType: null,
    panelStyle: null,
    dimension: null,
    postcode: null,
    externalColor: null,
    internalColor: null,
    glazingOption: null,
    handleColor: null,
  };

  const handleAddMoreProducts = () => {
    setSavedProducts((prev) => [
      ...prev,
      { productId, productTitle, selection: { ...selection } },
    ]);
    setSelection({ ...emptySelection });
    setCurrentStep(1);
  };

  const handleRemoveProduct = (index: number) => {
    setSavedProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const formatProductForSubmit = (sel: Selection) => ({
    productId: productId,
    productTitle: productTitle,
    doorType: sel.doorType?.name || "",
    panelStyle: sel.panelStyle?.name || "",
    dimension:
      sel.dimension && (sel.dimension.width || sel.dimension.height)
        ? `${sel.dimension.width || ""} x ${sel.dimension.height || ""}`
        : "",
    postcode: sel.postcode?.code || "",
    externalColor: sel.externalColor?.name || "",
    internalColor: sel.internalColor?.name || "",
    glazingOption: sel.glazingOption?.name || "",
    handleColor: sel.handleColor?.name || "",
  });

  const handleSubmitQuote = async () => {
    setSubmitting(true);
    try {
      const allProducts = [
        ...savedProducts.map((p) => formatProductForSubmit(p.selection)),
        formatProductForSubmit(selection),
      ];

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
            products: allProducts,
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

  // Reset pagination when step changes
  useEffect(() => {
    if (currentStep === 1) setDoorTypePage(1);
    if (currentStep === 2) setPanelStylePage(1);
    if (currentStep === 5) setExternalColorPage(1);
    if (currentStep === 6) setInternalColorPage(1);
    if (currentStep === 7) setGlazingOptionPage(1);
    if (currentStep === 8) setHandleColorPage(1);
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < STEPS.length && canProceed()) {
      let next = currentStep + 1;
      if (next === 2 && skipPanelStep) next = 3;
      setCurrentStep(next);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      let prev = currentStep - 1;
      if (prev === 2 && skipPanelStep) prev = 1;
      setCurrentStep(prev);
    }
  };

  const panelStepOk = skipPanelStep || selection.panelStyle;

  const handleStepClick = (step: number) => {
    // Allow going back to previous steps or current step
    if (step <= currentStep) {
      if (step === 2 && skipPanelStep) return;
      setCurrentStep(step);
    }
    // Allow going forward only if all previous steps are complete
    else if (step === 2 && selection.doorType && !skipPanelStep) {
      setCurrentStep(step);
    } else if (step === 3 && selection.doorType && panelStepOk) {
      setCurrentStep(step);
    } else if (
      step === 4 &&
      selection.doorType &&
      panelStepOk &&
      selection.dimension
    ) {
      setCurrentStep(step);
    } else if (
      step === 5 &&
      selection.doorType &&
      panelStepOk &&
      selection.dimension &&
      selection.postcode
    ) {
      setCurrentStep(step);
    } else if (
      step === 6 &&
      selection.doorType &&
      panelStepOk &&
      selection.dimension &&
      selection.postcode &&
      selection.externalColor
    ) {
      setCurrentStep(step);
    } else if (
      step === 7 &&
      selection.doorType &&
      panelStepOk &&
      selection.dimension &&
      selection.postcode &&
      selection.externalColor &&
      selection.internalColor
    ) {
      setCurrentStep(step);
    } else if (
      step === 8 &&
      selection.doorType &&
      panelStepOk &&
      selection.dimension &&
      selection.postcode &&
      selection.externalColor &&
      selection.internalColor &&
      selection.glazingOption
    ) {
      setCurrentStep(step);
    } else if (
      step === 9 &&
      selection.doorType &&
      panelStepOk &&
      selection.dimension &&
      selection.postcode &&
      selection.externalColor &&
      selection.internalColor &&
      selection.glazingOption &&
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
      <div className="mb-8">
        {/* Desktop Step Indicator - Connected Progress Line */}
        <div className="hidden lg:block">
          <div className="relative flex items-center justify-between">
            {/* Background line */}
            <div className="absolute top-5 left-[5%] right-[5%] h-0.5 bg-gray-200 z-0" />
            {/* Animated progress line */}
            <motion.div
              className="absolute top-5 left-[5%] h-0.5 bg-primary z-[1] origin-left"
              initial={{ width: "0%" }}
              animate={{
                width: `${((currentStep - 1) / (STEPS.length - 1)) * 90}%`,
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
            {STEPS.map((step) => {
              const StepIcon = STEP_ICONS[step.id - 1];
              const isActive = currentStep === step.id;
              const isCompleted = step.id < currentStep;
              return (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(step.id)}
                  className="relative z-10 flex flex-col items-center gap-1.5 group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                      isActive
                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/40 scale-110"
                        : isCompleted
                          ? "bg-primary border-primary text-white"
                          : "bg-white border-gray-200 text-gray-400 group-hover:border-primary/40",
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <StepIcon className="w-4 h-4" />
                    )}
                  </motion.div>
                  <span
                    className={cn(
                      "text-[10px] font-medium transition-colors whitespace-nowrap",
                      isActive
                        ? "text-primary font-semibold"
                        : isCompleted
                          ? "text-primary"
                          : "text-gray-400",
                    )}
                  >
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Step Indicator - Pill bar with icons */}
        <div className="lg:hidden">
          <div className="flex items-center gap-3 mb-4 px-1">
            <div className="flex items-center gap-1.5">
              {STEPS.map((step) => {
                const isActive = currentStep === step.id;
                const isCompleted = step.id < currentStep;
                return (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(step.id)}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      isActive
                        ? "w-8 bg-primary"
                        : isCompleted
                          ? "w-4 bg-primary/60"
                          : "w-2 bg-gray-200",
                    )}
                  />
                );
              })}
            </div>
            {/* Removed step count display */}
          </div>
          <div className="flex items-center gap-2 px-1">
            {(() => {
              const StepIcon = STEP_ICONS[currentStep - 1];
              return (
                <>
                  <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
                    <StepIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {STEPS[currentStep - 1].title}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {STEPS[currentStep - 1].description}
                    </p>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Step Content with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Step 1: Product Type */}
          {currentStep === 1 && (
            <div>
              <div className="text-center mb-3 sm:mb-4">
                <h2 className="text-xl sm:text-2xl font-bold">
                  Choose Product Type
                </h2>
                <p className="text-muted-foreground mt-1">
                  Select your product type
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {doorTypes
                  .slice(
                    (doorTypePage - 1) * CARDS_PER_PAGE,
                    doorTypePage * CARDS_PER_PAGE,
                  )
                  .map((type) => (
                    <div
                      key={type.id}
                      className={cn(
                        "group cursor-pointer rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col items-center justify-between p-2 min-h-[140px] sm:min-h-[180px] relative overflow-hidden",
                        selection.doorType?.id === type.id
                          ? "ring-2 ring-primary scale-105 shadow-primary/20"
                          : "hover:ring-1 hover:ring-primary/40",
                      )}
                      onClick={() => {
                        setSelection({ ...selection, doorType: type });
                      }}
                      style={{ marginTop: 0, marginBottom: 0 }}
                    >
                      <div className="w-full flex-1 flex items-center justify-center">
                        {type.image ? (
                          <img
                            src={type.image}
                            alt={type.name}
                            className="w-full h-20 sm:h-28 object-contain drop-shadow-sm transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-20 sm:h-28 bg-gray-100 rounded-xl" />
                        )}
                        {selection.doorType?.id === type.id && (
                          <div className="absolute top-2 right-2 w-7 h-7 bg-primary/90 rounded-full flex items-center justify-center shadow-lg">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="w-full mt-2">
                        <h3 className="font-semibold text-sm text-center text-emerald-700 group-hover:text-emerald-900 transition-colors">
                          {type.name}
                        </h3>
                      </div>
                    </div>
                  ))}
              </div>
              {/* Pagination for Product Type */}
              {doorTypes.length > CARDS_PER_PAGE && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDoorTypePage((p) => Math.max(1, p - 1))}
                    disabled={doorTypePage === 1}
                  >
                    Prev
                  </Button>
                  {/* Removed pagination text */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setDoorTypePage((p) =>
                        Math.min(
                          Math.ceil(doorTypes.length / CARDS_PER_PAGE),
                          p + 1,
                        ),
                      )
                    }
                    disabled={
                      doorTypePage ===
                      Math.ceil(doorTypes.length / CARDS_PER_PAGE)
                    }
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Panel Style */}
          {currentStep === 2 && (
            <div>
              <div className="text-center mb-3 sm:mb-4">
                <h2 className="text-xl sm:text-2xl font-bold">
                  Choose Panel Style
                </h2>
                <p className="text-muted-foreground mt-1">
                  Select your panel style
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {panelStyles
                  .slice(
                    (panelStylePage - 1) * CARDS_PER_PAGE,
                    panelStylePage * CARDS_PER_PAGE,
                  )
                  .map((style) => (
                    <div
                      key={style.id}
                      className={cn(
                        "group cursor-pointer rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col items-center justify-between p-2 min-h-[140px] sm:min-h-[180px] relative overflow-hidden",
                        selection.panelStyle?.id === style.id
                          ? "ring-2 ring-primary scale-105 shadow-primary/20"
                          : "hover:ring-1 hover:ring-primary/40",
                      )}
                      onClick={() => {
                        setSelection({ ...selection, panelStyle: style });
                        setTimeout(
                          () =>
                            setCurrentStep((s) =>
                              Math.min(s + 1, STEPS.length),
                            ),
                          300,
                        );
                      }}
                      style={{ marginTop: 0, marginBottom: 0 }}
                    >
                      <div className="w-full flex-1 flex items-center justify-center">
                        {style.image ? (
                          <img
                            src={style.image}
                            alt={style.name}
                            className="w-full h-20 sm:h-28 object-contain drop-shadow-sm transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-20 sm:h-28 bg-gray-100 rounded-xl" />
                        )}
                        {selection.panelStyle?.id === style.id && (
                          <div className="absolute top-2 right-2 w-7 h-7 bg-primary/90 rounded-full flex items-center justify-center shadow-lg">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="w-full mt-2">
                        <h3 className="font-semibold text-sm text-center text-emerald-700 group-hover:text-emerald-900 transition-colors">
                          {style.name}
                        </h3>
                      </div>
                    </div>
                  ))}
              </div>
              {/* Pagination for Panel Style */}
              {panelStyles.length > CARDS_PER_PAGE && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPanelStylePage((p) => Math.max(1, p - 1))}
                    disabled={panelStylePage === 1}
                  >
                    Prev
                  </Button>
                  {/* Removed pagination text */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPanelStylePage((p) =>
                        Math.min(
                          Math.ceil(panelStyles.length / CARDS_PER_PAGE),
                          p + 1,
                        ),
                      )
                    }
                    disabled={
                      panelStylePage ===
                      Math.ceil(panelStyles.length / CARDS_PER_PAGE)
                    }
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Dimensions */}
          {currentStep === 3 && (
            <div className="space-y-4 sm:space-y-6 max-w-md mx-auto px-1">
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold">
                  Enter Dimensions
                </h2>
                <p className="text-muted-foreground mt-2">
                  Enter width and height in mm
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <Input
                  type="number"
                  placeholder="Width (mm)"
                  value={selection.dimension?.width || ""}
                  onChange={(e) => {
                    const width = parseInt(e.target.value, 10) || 0;
                    setSelection({
                      ...selection,
                      dimension: {
                        id: selection.dimension?.id ?? 0,
                        width,
                        height: selection.dimension?.height || 0,
                      },
                    });
                  }}
                />
                <Input
                  type="number"
                  placeholder="Height (mm)"
                  value={selection.dimension?.height || ""}
                  onChange={(e) => {
                    const height = parseInt(e.target.value, 10) || 0;
                    setSelection({
                      ...selection,
                      dimension: {
                        id: selection.dimension?.id ?? 0,
                        width: selection.dimension?.width || 0,
                        height,
                      },
                    });
                  }}
                />
              </div>
            </div>
          )}

          {/* Step 4: Postcode */}
          {currentStep === 4 && (
            <div className="space-y-4 sm:space-y-6 max-w-md mx-auto px-1">
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold">
                  Enter Postcode
                </h2>
                <p className="text-muted-foreground mt-2">
                  Enter your postcode
                </p>
              </div>
              <Input
                type="text"
                placeholder="Postcode"
                value={selection.postcode?.code || ""}
                onChange={(e) => {
                  setSelection({
                    ...selection,
                    postcode: { id: 0, code: e.target.value },
                  });
                }}
              />
            </div>
          )}

          {/* Step 5: External Colors */}
          {currentStep === 5 && (
            <div>
              <div className="text-center mb-3 sm:mb-4">
                <h2 className="text-xl sm:text-2xl font-bold">
                  Choose External Color
                </h2>
                <p className="text-muted-foreground mt-1">
                  Select the outside finish for your door
                </p>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-2 sm:gap-3">
                {externalColors
                  .slice(
                    (externalColorPage - 1) * CARDS_PER_PAGE,
                    externalColorPage * CARDS_PER_PAGE,
                  )
                  .map((color) => (
                    <div
                      key={color.id}
                      className={cn(
                        "group cursor-pointer rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col items-center justify-between p-1.5 sm:p-2 min-h-[100px] sm:min-h-[140px] relative overflow-hidden",
                        selection.externalColor?.id === color.id
                          ? "ring-2 ring-primary scale-105 shadow-primary/20"
                          : "hover:ring-1 hover:ring-primary/40",
                      )}
                      onClick={() => {
                        setSelection({ ...selection, externalColor: color });
                        setTimeout(
                          () =>
                            setCurrentStep((s) =>
                              Math.min(s + 1, STEPS.length),
                            ),
                          300,
                        );
                      }}
                      style={{ marginTop: 0, marginBottom: 0 }}
                    >
                      <div className="w-full flex-1 flex items-center justify-center">
                        {color.image ? (
                          <img
                            src={color.image}
                            alt={color.name}
                            className="w-full h-16 object-contain drop-shadow-sm transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div
                            className="w-full h-16 rounded-xl"
                            style={{
                              backgroundColor: color.colorCode || "#ccc",
                            }}
                          />
                        )}
                        {selection.externalColor?.id === color.id && (
                          <div className="absolute top-2 right-2 w-7 h-7 bg-primary/90 rounded-full flex items-center justify-center shadow-lg">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="w-full mt-2">
                        <h3 className="font-semibold text-xs text-center text-emerald-700 group-hover:text-emerald-900 transition-colors">
                          {color.name}
                        </h3>
                      </div>
                    </div>
                  ))}
              </div>
              {/* Pagination for External Colors */}
              {externalColors.length > CARDS_PER_PAGE && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setExternalColorPage((p) => Math.max(1, p - 1))
                    }
                    disabled={externalColorPage === 1}
                  >
                    Prev
                  </Button>
                  {/* Removed pagination text */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setExternalColorPage((p) =>
                        Math.min(
                          Math.ceil(externalColors.length / CARDS_PER_PAGE),
                          p + 1,
                        ),
                      )
                    }
                    disabled={
                      externalColorPage ===
                      Math.ceil(externalColors.length / CARDS_PER_PAGE)
                    }
                  >
                    Next
                  </Button>
                </div>
              )}
              {externalColors.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No external colors available
                </div>
              )}
            </div>
          )}

          {/* Step 6: Internal Colors */}
          {currentStep === 6 && (
            <div>
              <div className="text-center mb-3 sm:mb-4">
                <h2 className="text-xl sm:text-2xl font-bold">
                  Choose Internal Color
                </h2>
                <p className="text-muted-foreground mt-1">
                  Select the inside finish for your door
                </p>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-2 sm:gap-3">
                {internalColors
                  .slice(
                    (internalColorPage - 1) * CARDS_PER_PAGE,
                    internalColorPage * CARDS_PER_PAGE,
                  )
                  .map((color) => (
                    <div
                      key={color.id}
                      className={cn(
                        "group cursor-pointer rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col items-center justify-between p-1.5 sm:p-2 min-h-[100px] sm:min-h-[140px] relative overflow-hidden",
                        selection.internalColor?.id === color.id
                          ? "ring-2 ring-primary scale-105 shadow-primary/20"
                          : "hover:ring-1 hover:ring-primary/40",
                      )}
                      onClick={() => {
                        setSelection({ ...selection, internalColor: color });
                        setTimeout(
                          () =>
                            setCurrentStep((s) =>
                              Math.min(s + 1, STEPS.length),
                            ),
                          300,
                        );
                      }}
                      style={{ marginTop: 0, marginBottom: 0 }}
                    >
                      <div className="w-full flex-1 flex items-center justify-center">
                        {color.image ? (
                          <img
                            src={color.image}
                            alt={color.name}
                            className="w-full h-16 object-contain drop-shadow-sm transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div
                            className="w-full h-16 rounded-xl"
                            style={{
                              backgroundColor: color.colorCode || "#ccc",
                            }}
                          />
                        )}
                        {selection.internalColor?.id === color.id && (
                          <div className="absolute top-2 right-2 w-7 h-7 bg-primary/90 rounded-full flex items-center justify-center shadow-lg">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="w-full mt-2">
                        <h3 className="font-semibold text-xs text-center text-emerald-700 group-hover:text-emerald-900 transition-colors">
                          {color.name}
                        </h3>
                      </div>
                    </div>
                  ))}
              </div>
              {/* Pagination for Internal Colors */}
              {internalColors.length > CARDS_PER_PAGE && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setInternalColorPage((p) => Math.max(1, p - 1))
                    }
                    disabled={internalColorPage === 1}
                  >
                    Prev
                  </Button>
                  {/* Removed pagination text */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setInternalColorPage((p) =>
                        Math.min(
                          Math.ceil(internalColors.length / CARDS_PER_PAGE),
                          p + 1,
                        ),
                      )
                    }
                    disabled={
                      internalColorPage ===
                      Math.ceil(internalColors.length / CARDS_PER_PAGE)
                    }
                  >
                    Next
                  </Button>
                </div>
              )}
              {internalColors.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No internal colors available
                </div>
              )}
            </div>
          )}

          {/* Step 7: Glazing Options */}
          {currentStep === 7 && (
            <div>
              <div className="text-center mb-3 sm:mb-4">
                <h2 className="text-xl sm:text-2xl font-bold">
                  Choose Glazing Option
                </h2>
                <p className="text-muted-foreground mt-1">
                  Select the glazing for your product
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {glazingOptions
                  .slice(
                    (glazingOptionPage - 1) * CARDS_PER_PAGE,
                    glazingOptionPage * CARDS_PER_PAGE,
                  )
                  .map((option) => (
                    <div
                      key={option.id}
                      className={cn(
                        "group cursor-pointer rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col items-center justify-between p-2 min-h-[140px] sm:min-h-[180px] relative overflow-hidden",
                        selection.glazingOption?.id === option.id
                          ? "ring-2 ring-primary scale-105 shadow-primary/20"
                          : "hover:ring-1 hover:ring-primary/40",
                      )}
                      onClick={() => {
                        setSelection({ ...selection, glazingOption: option });
                        setTimeout(
                          () =>
                            setCurrentStep((s) =>
                              Math.min(s + 1, STEPS.length),
                            ),
                          300,
                        );
                      }}
                      style={{ marginTop: 0, marginBottom: 0 }}
                    >
                      <div className="w-full flex-1 flex items-center justify-center">
                        {option.image ? (
                          <img
                            src={option.image}
                            alt={option.name}
                            className="w-full h-20 sm:h-28 object-contain drop-shadow-sm transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-20 sm:h-28 bg-gray-100 rounded-xl flex items-center justify-center">
                            <Layers className="w-10 h-10 text-gray-400" />
                          </div>
                        )}
                        {selection.glazingOption?.id === option.id && (
                          <div className="absolute top-2 right-2 w-7 h-7 bg-primary/90 rounded-full flex items-center justify-center shadow-lg">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="w-full mt-2">
                        <h3 className="font-semibold text-sm text-center text-emerald-700 group-hover:text-emerald-900 transition-colors">
                          {option.name}
                        </h3>
                      </div>
                    </div>
                  ))}
              </div>
              {glazingOptions.length > CARDS_PER_PAGE && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setGlazingOptionPage((p) => Math.max(1, p - 1))
                    }
                    disabled={glazingOptionPage === 1}
                  >
                    Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setGlazingOptionPage((p) =>
                        Math.min(
                          Math.ceil(glazingOptions.length / CARDS_PER_PAGE),
                          p + 1,
                        ),
                      )
                    }
                    disabled={
                      glazingOptionPage ===
                      Math.ceil(glazingOptions.length / CARDS_PER_PAGE)
                    }
                  >
                    Next
                  </Button>
                </div>
              )}
              {glazingOptions.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No glazing options available
                </div>
              )}
            </div>
          )}

          {/* Step 8: Handle Colors */}
          {currentStep === 8 && (
            <div>
              <div className="text-center mb-3 sm:mb-4">
                <h2 className="text-xl sm:text-2xl font-bold">
                  Choose Handle Color
                </h2>
                <p className="text-muted-foreground mt-1">
                  Select the handle finish for your door
                </p>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-2 sm:gap-3">
                {handleColors
                  .slice(
                    (handleColorPage - 1) * CARDS_PER_PAGE,
                    handleColorPage * CARDS_PER_PAGE,
                  )
                  .map((color) => (
                    <div
                      key={color.id}
                      className={cn(
                        "group cursor-pointer rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col items-center justify-between p-1.5 sm:p-2 min-h-[100px] sm:min-h-[140px] relative overflow-hidden",
                        selection.handleColor?.id === color.id
                          ? "ring-2 ring-primary scale-105 shadow-primary/20"
                          : "hover:ring-1 hover:ring-primary/40",
                      )}
                      onClick={() => {
                        setSelection({ ...selection, handleColor: color });
                        setTimeout(
                          () =>
                            setCurrentStep((s) =>
                              Math.min(s + 1, STEPS.length),
                            ),
                          300,
                        );
                      }}
                      style={{ marginTop: 0, marginBottom: 0 }}
                    >
                      <div className="w-full flex-1 flex items-center justify-center">
                        {color.image ? (
                          <img
                            src={color.image}
                            alt={color.name}
                            className="w-full h-16 object-contain drop-shadow-sm transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div
                            className="w-full h-16 rounded-xl"
                            style={{
                              backgroundColor: color.colorCode || "#ccc",
                            }}
                          />
                        )}
                        {selection.handleColor?.id === color.id && (
                          <div className="absolute top-2 right-2 w-7 h-7 bg-primary/90 rounded-full flex items-center justify-center shadow-lg">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="w-full mt-2">
                        <h3 className="font-semibold text-xs text-center text-emerald-700 group-hover:text-emerald-900 transition-colors">
                          {color.name}
                        </h3>
                      </div>
                    </div>
                  ))}
              </div>
              {/* Pagination for Handle Colors */}
              {handleColors.length > CARDS_PER_PAGE && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setHandleColorPage((p) => Math.max(1, p - 1))
                    }
                    disabled={handleColorPage === 1}
                  >
                    Prev
                  </Button>
                  {/* Removed pagination text */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setHandleColorPage((p) =>
                        Math.min(
                          Math.ceil(handleColors.length / CARDS_PER_PAGE),
                          p + 1,
                        ),
                      )
                    }
                    disabled={
                      handleColorPage ===
                      Math.ceil(handleColors.length / CARDS_PER_PAGE)
                    }
                  >
                    Next
                  </Button>
                </div>
              )}
              {handleColors.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No handle colors available
                </div>
              )}
            </div>
          )}

          {/* Step 9: Summary with Contact Details */}
          {currentStep === 9 && (
            <div>
              <div>
                {!submitted && (
                  <>
                    <div className="space-y-4 sm:space-y-6">
                      {/* Previously saved products */}
                      {savedProducts.length > 0 && (
                        <div className="px-1 sm:px-2">
                          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3">
                            Your Products ({savedProducts.length + 1})
                          </h2>
                          <div className="space-y-3">
                            {savedProducts.map((saved, index) => (
                              <Card key={index} className="relative">
                                <div className="p-3 sm:p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                      Product {index + 1}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                                      onClick={() => handleRemoveProduct(index)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] sm:text-xs">
                                    {saved.selection.doorType && (
                                      <div>
                                        <span className="text-muted-foreground">Type:</span>{" "}
                                        <span className="font-medium">{saved.selection.doorType.name}</span>
                                      </div>
                                    )}
                                    {saved.selection.panelStyle && (
                                      <div>
                                        <span className="text-muted-foreground">Panel:</span>{" "}
                                        <span className="font-medium">{saved.selection.panelStyle.name}</span>
                                      </div>
                                    )}
                                    {saved.selection.dimension && (
                                      <div>
                                        <span className="text-muted-foreground">Size:</span>{" "}
                                        <span className="font-medium">
                                          {saved.selection.dimension.width} x {saved.selection.dimension.height} mm
                                        </span>
                                      </div>
                                    )}
                                    {saved.selection.postcode && (
                                      <div>
                                        <span className="text-muted-foreground">Postcode:</span>{" "}
                                        <span className="font-medium">{saved.selection.postcode.code}</span>
                                      </div>
                                    )}
                                    {saved.selection.externalColor && (
                                      <div>
                                        <span className="text-muted-foreground">Ext Color:</span>{" "}
                                        <span className="font-medium">{saved.selection.externalColor.name}</span>
                                      </div>
                                    )}
                                    {saved.selection.internalColor && (
                                      <div>
                                        <span className="text-muted-foreground">Int Color:</span>{" "}
                                        <span className="font-medium">{saved.selection.internalColor.name}</span>
                                      </div>
                                    )}
                                    {saved.selection.glazingOption && (
                                      <div>
                                        <span className="text-muted-foreground">Glazing:</span>{" "}
                                        <span className="font-medium">{saved.selection.glazingOption.name}</span>
                                      </div>
                                    )}
                                    {saved.selection.handleColor && (
                                      <div>
                                        <span className="text-muted-foreground">Handle:</span>{" "}
                                        <span className="font-medium">{saved.selection.handleColor.name}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Current product review */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                        <div className="px-1 sm:px-2">
                          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3">
                            {savedProducts.length > 0
                              ? `Product ${savedProducts.length + 1} (Current)`
                              : "Review Your Selection"}
                          </h2>
                          <Card>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3 sm:p-4">
                              {selection.doorType && (
                                <img
                                  src={
                                    selection.doorType.image ||
                                    "/placeholder.jpg"
                                  }
                                  alt={selection.doorType.name}
                                  className="w-full h-40 sm:h-52 md:h-64 object-contain bg-gray-50"
                                />
                              )}
                              <div>
                                <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1 sm:mt-2">
                                  Here's a summary of your configuration
                                </p>
                                <ul>
                                  <li className="flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                                    <h3 className="font-semibold text-primary text-[10px] sm:text-xs flex-shrink-0 flex items-center gap-1">
                                      <DoorOpen className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />{" "}
                                      Product Type
                                    </h3>{" "}
                                    -
                                    {selection.doorType && (
                                      <p className="font-medium text-[10px] sm:text-xs">
                                        {selection.doorType.name}
                                      </p>
                                    )}
                                  </li>
                                  {!skipPanelStep && (
                                    <li className="flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                                      <h3 className="font-semibold text-primary text-[10px] sm:text-xs flex-shrink-0 flex items-center gap-1">
                                        <PanelTop className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />{" "}
                                        Panel Style
                                      </h3>{" "}
                                      -
                                      {selection.panelStyle && (
                                        <p className="font-medium text-[10px] sm:text-xs">
                                          {selection.panelStyle.name}
                                        </p>
                                      )}
                                    </li>
                                  )}
                                  <li className="flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                                    <h3 className="font-semibold text-primary text-[10px] sm:text-xs flex-shrink-0 flex items-center gap-1">
                                      <Ruler className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />{" "}
                                      Dimensions
                                    </h3>{" "}
                                    -
                                    {selection.dimension && (
                                      <>
                                        <p className="font-medium text-[10px] sm:text-xs">
                                          {selection.dimension.width} x{" "}
                                          {selection.dimension.height}
                                        </p>
                                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                                          mm
                                        </p>
                                      </>
                                    )}
                                  </li>
                                  <li className="flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                                    <h3 className="font-semibold text-primary text-[10px] sm:text-xs flex-shrink-0 flex items-center gap-1">
                                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />{" "}
                                      Postcode
                                    </h3>{" "}
                                    -
                                    {selection.postcode && (
                                      <p className="font-medium text-[10px] sm:text-xs">
                                        {selection.postcode.code}
                                      </p>
                                    )}
                                  </li>
                                  <li className="flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                                    <h3 className="font-semibold text-primary text-[10px] sm:text-xs flex-shrink-0 flex items-center gap-1">
                                      <Palette className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />{" "}
                                      External Color
                                    </h3>{" "}
                                    -
                                    {selection.externalColor && (
                                      <p className="font-medium text-[10px] sm:text-xs">
                                        {selection.externalColor.name}
                                      </p>
                                    )}
                                  </li>
                                  <li className="flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                                    <h3 className="font-semibold text-primary text-[10px] sm:text-xs flex-shrink-0 flex items-center gap-1">
                                      <PaintBucket className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />{" "}
                                      Internal Color
                                    </h3>{" "}
                                    -
                                    {selection.internalColor && (
                                      <p className="font-medium text-[10px] sm:text-xs">
                                        {selection.internalColor.name}
                                      </p>
                                    )}
                                  </li>
                                  <li className="flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                                    <h3 className="font-semibold text-primary text-[10px] sm:text-xs flex-shrink-0 flex items-center gap-1">
                                      <Layers className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />{" "}
                                      Glazing
                                    </h3>{" "}
                                    -
                                    {selection.glazingOption && (
                                      <p className="font-medium text-[10px] sm:text-xs">
                                        {selection.glazingOption.name}
                                      </p>
                                    )}
                                  </li>
                                  <li className="flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                                    <h3 className="font-semibold text-primary text-[10px] sm:text-xs flex-shrink-0 flex items-center gap-1">
                                      <Grip className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />{" "}
                                      Handle Color
                                    </h3>{" "}
                                    -
                                    {selection.handleColor && (
                                      <p className="font-medium text-[10px] sm:text-xs">
                                        {selection.handleColor.name}
                                      </p>
                                    )}
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </Card>

                          {/* Add More Products Button */}
                          <div className="mt-4">
                            <Button
                              variant="outline"
                              className="w-full gap-2 border-dashed border-2 border-primary/40 text-primary hover:bg-primary/5 hover:border-primary"
                              onClick={handleAddMoreProducts}
                            >
                              <Plus className="w-4 h-4" />
                              Add More Products
                            </Button>
                          </div>
                        </div>
                        {/* Contact Details Form */}
                        <div className="mt-4 sm:mt-6 md:mt-8">
                          <div className="mb-3 sm:mb-4">
                            <h3 className="text-lg sm:text-xl font-semibold">
                              Enter Your Contact Details
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              Fill in your details to receive your quote
                              {savedProducts.length > 0 &&
                                ` for ${savedProducts.length + 1} product${savedProducts.length > 0 ? "s" : ""}`}
                            </p>
                          </div>
                          <div className="mx-auto space-y-3 sm:space-y-4 px-2 sm:px-0">
                            <div className="space-y-1.5 sm:space-y-2">
                              <label
                                htmlFor="name"
                                className="text-xs sm:text-sm font-medium"
                              >
                                Full Name{" "}
                                <span className="text-red-500">*</span>
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
                                Email Address{" "}
                                <span className="text-red-500">*</span>
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
                                Phone Number{" "}
                                <span className="text-red-500">*</span>
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
                      </div>
                    </div>
                    <div className="flex justify-center pt-4 sm:pt-6">
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
                          `Get Quote${savedProducts.length > 0 ? ` (${savedProducts.length + 1} Products)` : ""}`
                        )}
                      </Button>
                    </div>
                  </>
                )}
                {submitted && (
                  <div className="flex justify-center pt-4 sm:pt-6">
                    <div className="text-center space-y-3 sm:space-y-4 px-4">
                      <div className="w-12 sm:w-16 h-12 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <Check className="w-6 sm:w-8 h-6 sm:h-8 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-green-600">
                          Quote Submitted!
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground mt-2">
                          Thank you, {contactDetails.name}! We'll contact you
                          soon at {contactDetails.email}
                          {savedProducts.length > 0 &&
                            ` regarding your ${savedProducts.length + 1} products`}
                          .
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1 || submitted}
          className="gap-1.5 sm:gap-2 h-10 sm:h-11 px-4 sm:px-5 rounded-xl border-gray-200 hover:bg-gray-50 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </Button>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Step {currentStep} of {STEPS.length}
          </span>
          {currentStep < STEPS.length && (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="gap-1.5 sm:gap-2 h-10 sm:h-11 px-5 sm:px-6 rounded-xl bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30"
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
