import { Wallet } from "tabler-icons-react";

interface Props {
  setModalOpen: (value: boolean) => void;
  modalOpen: boolean;
  arConnect: () => void;
  arWallet: () => void;
}

export default function ConnectWallet({
  setModalOpen,
  arConnect,
  arWallet,
}: Props) {
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-[500px] my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-3xl shadow-lg flex flex-col w-full bg-white outline-none focus:outline-none p-10 relative">
            <div className="flex">
              <Wallet size={90} strokeWidth={1} color={"black"} />
            </div>

            <button
              className="bg-black border border-white hover:bg-white hover:text-black hover:border hover:border-black text-white font-bold
              absolute right-14 top-14 rounded-full w-10 h-10"
              type="button"
              onClick={() => setModalOpen(false)}
            >
              x
            </button>

            <h2 className="text-black font-semibold text-2xl ml-4 mt-6">
              Arweave Wallet Needed
            </h2>

            <p className="text-black font-semibold ml-4 mt-6">
              Select your preferred wallet below:
            </p>

            <div className="w-full flex flex-col gap-4 mt-6">
              <button
                className="bg-black border border-white hover:bg-white hover:text-black hover:border hover:border-black text-white font-bold py-4 px-10 rounded-full"
                onClick={arConnect}
              >
                ArConnect
              </button>
              <button
                onClick={arWallet}
                className="border border-black hover:border hover:border-white hover:text-white font-bold py-4 px-10 btn rounded-full bg-[#E4E6F1] text-black hover:bg-gray-400"
              >
                Arweave.app
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
