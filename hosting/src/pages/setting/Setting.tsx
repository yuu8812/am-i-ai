import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Transition from "src/animate/Transition";
import useEditUser from "src/api/useEditUser";
import useFindMe from "src/api/useFindMe";
import Button from "src/component/Button";
import TextArea from "src/component/TextArea";
import TitleArea from "src/component/TitleArea";

const Setting = () => {
  const [name, setName] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  const { data: me, mutate } = useFindMe();
  const { editUser } = useEditUser();

  const changed = name !== me?.name;

  const handleSubmit = useCallback(async () => {
    const res = await editUser({ name }).catch(() => {
      toast.error("Failed to update");
    });
    if (res) {
      toast.success("Updated");
      await mutate();
    }
  }, [editUser, name, mutate]);

  const setUp = useCallback(() => {
    if (!me) return;
    setName(me.name);
  }, [me]);

  useEffect(() => {
    setUp();
  }, [setUp]);

  return (
    <div className="flex flex-1 flex-col">
      <TitleArea title="Setting" />
      <Transition>
        <form className="flex flex-1 flex-col">
          <div className="h-8"></div>
          <div className="flex gap-4 lg:w-80 w-full lg:items-center flex-col lg:flex-row">
            <div className="text-white">Name </div>
            <TextArea
              inputRef={ref}
              onChange={(e) => setName(e.target.value)}
              value={name}
              height={"h-8"}
              fontSize="text-sm"
            />
          </div>
          <div className="fixed bottom-10 right-10">
            <Button
              onCLick={handleSubmit}
              message="save"
              width="w-60"
              disabled={!changed}
              type="submit"
            />
          </div>
        </form>
      </Transition>
    </div>
  );
};

export default Setting;
