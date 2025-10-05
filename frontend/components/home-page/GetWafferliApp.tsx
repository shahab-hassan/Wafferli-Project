import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/common/button";
import Image from "next/image";

const GetWafferliApp: React.FC = () => {
    const locale = useLocale();
    const t = useTranslations("getWafferliApp");
    const isRTL = locale === "ar";


    const ArrowDownloadIcon = () => (
        <svg
            width="17"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M8.5 10.1611V2.16113"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M14.5 10.1611V12.8278C14.5 13.1814 14.3595 13.5206 14.1095 13.7706C13.8594 14.0207 13.5203 14.1611 13.1667 14.1611H3.83333C3.47971 14.1611 3.14057 14.0207 2.89052 13.7706C2.64048 13.5206 2.5 13.1814 2.5 12.8278V10.1611"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M5.16667 6.82764L8.5 10.161L11.8333 6.82764"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )


    return (
        <section
            className="w-full from-tertiary to-secondary py-12 md:py-16 lg:py-20"
            dir={isRTL ? "rtl" : "ltr"}
        >
            <div className="max-w-[1120px] mx-auto px-4 md:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
                    {/* Text Content */}
                    <div className="flex flex-col justify-center space-y-6 md:space-y-8">
                        <h2 className="text-h3 md:text-h2 font-bold text-black-1">
                            {t("title")}
                        </h2>
                        <p className="text-normal-regular md:text-medium-regular text-black-3 max-w-prose">
                            {t("subtitle")}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="flex-shrink-0 w-10 h-10 md:w-[70px] md:h-[70px] rounded-full bg-tertiary flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6 md:w-[50px] md:h-[50px] text-primary"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1}
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-h6 md:text-h5 font-semibold text-black-1">
                                        {t("instantAlerts.title")}
                                    </h3>
                                    <p className="text-small-regular text-black-3">
                                        {t("instantAlerts.description")}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="flex-shrink-0 bg-tertiary w-10 h-10 md:w-[70px] md:h-[70px] rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6 md:w-[50px] md:h-[50px] text-primary"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1}
                                            d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-h6 md:text-h5 font-semibold text-black-1">
                                        {t("exclusiveOffers.title")}
                                    </h3>
                                    <p className="text-small-regular text-black-3">
                                        {t("exclusiveOffers.description")}
                                    </p>
                                </div>
                            </div>

                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                            <Button
                                variant="secondary"
                                size="lg"
                                leadingIcon={!isRTL ? <ArrowDownloadIcon /> : undefined}
                                trailingIcon={isRTL ? <ArrowDownloadIcon /> : undefined}
                            >
                                {t("buttons.ios")}
                            </Button>
                            <Button
                                variant="secondary"
                                size="lg"
                                leadingIcon={!isRTL ? <ArrowDownloadIcon /> : undefined}
                                trailingIcon={isRTL ? <ArrowDownloadIcon /> : undefined}
                            >
                                {t("buttons.android")}
                            </Button>
                        </div>

                    </div>

                    {/* Image */}
                    <div className="relative flex justify-center md:justify-end rtl:md:justify-start">
                        <Image
                            src="/waferli-app-section.png"
                            alt={t("imageAlt")}
                            width={500}
                            height={500}
                            className="w-full max-w-[400px] md:max-w-[500px] h-auto object-contain"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GetWafferliApp;