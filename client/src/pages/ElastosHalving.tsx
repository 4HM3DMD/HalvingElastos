import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const countdownData = {
  days: [
    {
      digit: "3",
      topImage: "/figmaAssets/elastos-1-1657x89600-2.png",
      bottomImage: "/figmaAssets/elastos-1-1657x89600-3.png",
    },
    {
      digit: "4",
      topImage: "/figmaAssets/elastos-1-1657x89600-4.png",
      bottomImage: "/figmaAssets/elastos-1-1657x89600-5.png",
    },
    {
      digit: "9",
      topImage: "/figmaAssets/elastos-1-1657x89600-4-1.png",
      bottomImage: "/figmaAssets/elastos-1-1657x89600-5-1.png",
    },
  ],
  hours: [
    {
      digit: "0",
      topImage: "/figmaAssets/elastos-1-1657x89600-4-2.png",
      bottomImage: "/figmaAssets/elastos-1-1657x89600-5-2.png",
    },
    {
      digit: "5",
      topImage: "/figmaAssets/elastos-1-1657x89600-4-3.png",
      bottomImage: "/figmaAssets/elastos-1-1657x89600-5-3.png",
    },
  ],
  minutes: [
    {
      digit: "4",
      topImage: "/figmaAssets/elastos-1-1657x89600-4-4.png",
      bottomImage: "/figmaAssets/elastos-1-1657x89600-5-4.png",
    },
    {
      digit: "3",
      topImage: "/figmaAssets/elastos-1-1657x89600-4-5.png",
      bottomImage: "/figmaAssets/elastos-1-1657x89600-5-5.png",
    },
  ],
  seconds: [
    {
      digit: "2",
      topImage: "/figmaAssets/elastos-1-1657x89600-4-6.png",
      bottomImage: "/figmaAssets/elastos-1-1657x89600-5-6.png",
    },
    {
      digit: "1",
      topImage: "/figmaAssets/elastos-1-1657x89600-4-7.png",
      bottomImage: "/figmaAssets/elastos-1-1657x89600-5-7.png",
    },
  ],
};

const infoCards = [
  {
    icon: "/figmaAssets/svg.svg",
    value: "45,620",
    label: "Current Block",
  },
  {
    icon: "/figmaAssets/group-40062.png",
    value: "5,620",
    label: "Elastos Halving at Block",
  },
  {
    icon: "/figmaAssets/group-40064.png",
    value: "34,340",
    label: "Block To Go",
  },
];

const FlipDigit = ({
  digit,
  topImage,
  bottomImage,
}: { digit: string; topImage: string; bottomImage: string }) => (
  <div className="w-[78.68px] h-[90px] relative">
    <img
      className="absolute top-0 left-px w-[74px] h-[46px]"
      alt="Elastos"
      src={topImage}
    />
    <img
      className="absolute top-[46px] left-px w-[74px] h-11"
      alt="Elastos"
      src={bottomImage}
    />
    <div className="absolute top-[46px] left-[73px] w-1 h-1.5 bg-white rounded-[0px_0px_4px_4px]" />
    <div className="absolute top-[46px] left-0 w-1 h-1.5 bg-white rounded-[0px_0px_4px_4px]" />
    <div className="absolute top-[41px] left-[73px] w-1 h-1.5 bg-[#ffffffe6] rounded-[0px_0px_4px_4px] -rotate-180" />
    <div className="absolute top-[41px] left-px w-1 h-1.5 bg-[#ffffffe6] rounded-[0px_0px_4px_4px] -rotate-180" />
    <div className="absolute top-[46px] left-0.5 w-[73px] h-11 rounded-[20px_20px_0px_0px] -rotate-180 bg-[linear-gradient(0deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%)]" />
    <div className="absolute top-[calc(50.00%_-_38px)] left-[calc(50.00%_-_18px)] w-[35px] h-20 flex items-center justify-center [font-family:'PP_Telegraf-Ultralight',Helvetica] font-normal text-white text-[64px] text-center tracking-[2.56px] leading-[normal]">
      {digit}
    </div>
  </div>
);

const TimeSeparator = () => (
  <div className="w-[7px] h-[27px] flex flex-col gap-[13.2px]">
    <div className="w-[6.73px] h-[6.73px] bg-white rounded-[3.37px]" />
    <div className="w-[6.73px] h-[6.73px] bg-white rounded-[3.37px]" />
  </div>
);

export const ElastosHalving = (): JSX.Element => {
  return (
    <div className="bg-[#141414] w-full min-w-[1512px] min-h-[982px] relative">
      <img
        className="absolute top-20 left-0 w-[1512px] h-[306px]"
        alt="Mask group"
        src="/figmaAssets/mask-group.png"
      />

      <img
        className="absolute top-20 left-[calc(50.00%_-_129px)] w-[258px] h-[220px]"
        alt="Elastos"
        src="/figmaAssets/elastos-1-1680x919--22--copy00-1.png"
      />

      <h1 className="absolute top-[310px] left-[calc(50.00%_-_163px)] text-[46px] text-center tracking-[1.84px] leading-[normal] [font-family:'PP_Telegraf-Ultralight',Helvetica] font-normal text-white">
        Elastos Halving
      </h1>

      <div className="absolute top-[628px] left-[calc(50.00%_-_478px)] w-[956px] h-[60px] bg-[#ffffff0d] rounded-[20px]" />

      <section className="absolute top-[426px] left-[calc(50.00%_-_478px)] w-[964px] h-[172px]">
        <div className="absolute top-0 left-0 w-[295px] h-[172px] bg-[#ffffff0d] rounded-[20px]" />
        <div className="absolute top-0 left-[328px] w-[628px] h-[172px] bg-[#ffffff0d] rounded-[20px]" />

        <div className="absolute top-[19px] left-[calc(50.00%_-_358px)] [font-family:'PP_Telegraf-Ultralight',Helvetica] font-normal text-white text-xl text-center tracking-[0.80px] leading-[normal]">
          Days
        </div>
        <div className="absolute top-[19px] left-[calc(50.00%_-_78px)] [font-family:'PP_Telegraf-Ultralight',Helvetica] font-normal text-white text-xl text-center tracking-[0.80px] leading-[normal]">
          Hours
        </div>
        <div className="absolute top-[19px] left-[calc(50.00%_+_122px)] [font-family:'PP_Telegraf-Ultralight',Helvetica] font-normal text-white text-xl text-center tracking-[0.80px] leading-[normal]">
          Minutes
        </div>
        <div className="absolute top-[19px] left-[calc(50.00%_+_328px)] [font-family:'PP_Telegraf-Ultralight',Helvetica] font-normal text-white text-xl text-center tracking-[0.80px] leading-[normal]">
          Seconds
        </div>

        <div className="absolute top-[59px] left-[22px] w-[250px] h-[90px] flex gap-2">
          {countdownData.days.map((item, index) => (
            <FlipDigit
              key={`day-${index}`}
              digit={item.digit}
              topImage={item.topImage}
              bottomImage={item.bottomImage}
            />
          ))}
        </div>

        <div className="absolute top-[59px] left-[350px] w-[163px] h-[90px] flex gap-2">
          {countdownData.hours.map((item, index) => (
            <FlipDigit
              key={`hour-${index}`}
              digit={item.digit}
              topImage={item.topImage}
              bottomImage={item.bottomImage}
            />
          ))}
        </div>

        <div className="absolute top-[59px] left-[560px] w-[163px] h-[90px] flex gap-2">
          {countdownData.minutes.map((item, index) => (
            <FlipDigit
              key={`minute-${index}`}
              digit={item.digit}
              topImage={item.topImage}
              bottomImage={item.bottomImage}
            />
          ))}
        </div>

        <div className="absolute top-[59px] left-[770px] w-[163px] h-[90px] flex gap-2">
          {countdownData.seconds.map((item, index) => (
            <FlipDigit
              key={`second-${index}`}
              digit={item.digit}
              topImage={item.topImage}
              bottomImage={item.bottomImage}
            />
          ))}
        </div>

        <div className="absolute top-[91px] left-[743px]">
          <TimeSeparator />
        </div>
        <div className="absolute top-[91px] left-[533px]">
          <TimeSeparator />
        </div>
      </section>

      <div className="absolute top-[646px] left-[calc(50.00%_-_446px)] [font-family:'PP_Telegraf-Ultralight',Helvetica] font-normal text-white text-lg text-center tracking-[0.72px] leading-[normal]">
        Estimated date &amp; time of reward drop:
      </div>

      <div className="absolute top-[646px] left-[calc(50.00%_+_288px)] [font-family:'PP_Telegraf-Regular',Helvetica] font-normal text-[#94b5ff] text-lg text-center tracking-[0.72px] leading-[normal]">
        1 May 2026 15:38
      </div>

      <div className="absolute top-[718px] left-[278px] flex gap-[25px]">
        {infoCards.map((card, index) => (
          <Card
            key={`info-card-${index}`}
            className="w-[302px] h-[82px] bg-[#95b5ff1a] rounded-2xl border-[0.5px] border-solid border-[#94b5ff]"
          >
            <CardContent className="p-0 h-full flex items-center">
              <img
                className="ml-[26px] w-8 h-8"
                alt={card.label}
                src={card.icon}
              />
              <div className="ml-[20px] flex flex-col">
                <div className="h-8 flex items-center justify-start [font-family:'PP_Telegraf-Regular',Helvetica] font-normal text-white text-xl tracking-[0.80px] leading-8 whitespace-nowrap">
                  {card.value}
                </div>
                <div className="h-5 flex items-center justify-start [font-family:'PP_Telegraf-Ultralight',Helvetica] font-normal text-white text-sm tracking-[0.56px] leading-5 whitespace-nowrap">
                  {card.label}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <footer className="absolute left-0 bottom-0 w-[1512px] h-[60px] bg-[#141414]">
        <div className="absolute top-5 left-[calc(50.00%_-_711px)] w-[1423px] h-5 flex gap-[1082px]">
          <div className="flex items-center justify-center self-end w-[262px] h-5 [font-family:'PP_Telegraf-Ultralight',Helvetica] font-normal text-white text-base tracking-[0.64px] leading-5 whitespace-nowrap">
            © 2025 Elastos. All rights reserved.
          </div>

          <div className="w-[79px] flex items-end gap-1.5">
            <div className="mb-px w-4 h-4 bg-[url(/figmaAssets/elastos.png)] bg-cover bg-[50%_50%]" />
            <div className="flex items-center justify-center w-[55px] h-5 text-base tracking-[0.64px] leading-5 whitespace-nowrap [font-family:'PP_Telegraf-Ultralight',Helvetica] font-normal text-white">
              Elastos
            </div>
          </div>
        </div>

        <img
          className="absolute left-0 bottom-[60px] w-[1512px] h-px"
          alt="Vector"
          src="/figmaAssets/vector-259.svg"
        />
      </footer>
    </div>
  );
};
