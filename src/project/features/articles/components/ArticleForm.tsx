import { Dispatch, FormEvent, SetStateAction, useRef, useState } from "react";
import { mutate } from "swr";
import { ValidationError } from "yup";
import useAxiosPrivateMultipart from "../../../../hooks/useAxiosPrivateMultipart";
import { IArticle } from "../../../../interfaces/interfaces";
import { articleSchema } from "../../../../validations/articleSchema";

interface IProps {
  patchMethod?: boolean;
  setIsModalActive: Dispatch<SetStateAction<boolean>>;
  focusedArticle: IArticle;
  setRequestMessage: Dispatch<SetStateAction<{ success: string; error: string }>>;
}

interface IFormErrors {
  title: string;
  content: string;
  mainImageUrl: string;
  firstAdditionalImage: string;
  secondAdditionalImage: string;
  thirdAdditionalImage: string;
  visible: boolean;
}

const ArticleForm = ({
  patchMethod,
  focusedArticle,
  setIsModalActive,
  setRequestMessage,
}: IProps) => {
  //
  const axiosPrivateMultipart = useAxiosPrivateMultipart();
  const [formErrors, setFormErrors] = useState({} as IFormErrors);
  const articleTitleRef = useRef<HTMLInputElement>(null);
  const articleContentRef = useRef<HTMLTextAreaElement>(null);
  const articleMainImageRef = useRef<HTMLInputElement>(null);
  const articleFirstAdditionalImageRef = useRef<HTMLInputElement>(null);
  const articleSecondAdditionalImageRef = useRef<HTMLInputElement>(null);
  const articleThirdAdditionalImageRef = useRef<HTMLInputElement>(null);
  const isArticleVisibleRef = useRef<HTMLInputElement>(null);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let errors = {} as IFormErrors;

    const bodyRequest = {
      title: articleTitleRef.current!.value,
      content: articleContentRef.current!.value,
      visible: isArticleVisibleRef.current!.checked,
    };

    await articleSchema
      .validate(bodyRequest, { abortEarly: false })
      .then(async () => {
        setIsModalActive?.(false);

        let formData = new FormData();
        articleMainImageRef.current?.files?.[0] &&
          formData.append("mainFile", articleMainImageRef.current?.files[0]);
        articleFirstAdditionalImageRef.current?.files?.[0] &&
          formData.append("firstAddFile", articleFirstAdditionalImageRef.current?.files[0]);
        articleSecondAdditionalImageRef.current?.files?.[0] &&
          formData.append("secondAddFile", articleSecondAdditionalImageRef.current?.files[0]);
        articleThirdAdditionalImageRef.current?.files?.[0] &&
          formData.append("thirdAddFile", articleThirdAdditionalImageRef.current?.files[0]);
        formData.append("data", JSON.stringify(bodyRequest));

        if (!patchMethod) {
          await mutate(
            "/articles",
            await axiosPrivateMultipart
              .post("/article", formData)
              .then((res) => {
                setRequestMessage({ success: "L'article a bien été créé ! 👌", error: "" });
                return res.data;
              })
              .catch((err) => {
                console.error(err);
                setRequestMessage({
                  success: "",
                  error: "Une erreur est survenue lors de la création de l'article ! 🤕",
                });
              }),
            {
              optimisticData: (articles: Array<IArticle>) =>
                [...articles, { id: articles.length, ...bodyRequest } as IArticle].sort(
                  (a: IArticle, b: IArticle) =>
                    Number(new Date(b.updatedAt || b.createdAt)) -
                    Number(new Date(a.updatedAt || a.createdAt))
                ),
              populateCache: (newArticle: IArticle, articles: Array<IArticle>) => [
                ...articles,
                newArticle,
              ],
              revalidate: false,
              rollbackOnError: true,
            }
          );
        } else {
          await mutate(
            "/tournaments",
            axiosPrivateMultipart
              .post(`/article/${focusedArticle.id}`, formData)
              .then((res) => {
                console.log("test update");
                setRequestMessage({ success: "L'article a bien été modifié ! 👌", error: "" });
                return res.data;
              })
              .catch((err) => {
                console.error(err);
                setRequestMessage({
                  success: "",
                  error: "Une erreur est survenue lors de la modification de l'article ! 🤕",
                });
              }),
            {
              optimisticData: (articles: Array<IArticle>) => {
                const prev = articles.filter(
                  (article: IArticle) => article.id !== focusedArticle.id
                );
                return [...prev, { id: focusedArticle.id, ...bodyRequest } as IArticle].sort(
                  (a: IArticle, b: IArticle) =>
                    Number(new Date(b.updatedAt || b.createdAt)) -
                    Number(new Date(a.updatedAt || a.createdAt))
                );
              },
              populateCache: (newArticle: IArticle, articles: Array<IArticle>) => {
                const prev = articles.filter(
                  (article: IArticle) => article.id !== focusedArticle.id
                );
                return [...prev, newArticle];
              },
              revalidate: false,
              rollbackOnError: true,
            }
          );
        }

        setTimeout(() => {
          setRequestMessage({ success: "", error: "" });
        }, 10000);
        window.scrollTo(0, 0);
      })
      .catch((err) => {
        console.dir(err);

        err.inner.forEach(
          (err: ValidationError) => (errors = { ...errors, [err.path as string]: err.message })
        );
      });

    setFormErrors(errors);
  };

  //
  return (
    <form className="form" onSubmit={handleFormSubmit}>
      <div className="form-row">
        <label htmlFor="tournamentName">Titre de l&apos;article</label>
        {formErrors.title && <div className="form-error-detail">{formErrors.title}</div>}
        <input
          type="text"
          id="articleTitle"
          className={formErrors.title ? "form-error" : undefined}
          autoFocus
          defaultValue={focusedArticle?.title || undefined}
          ref={articleTitleRef}
        />
      </div>

      <div className="form-row">
        <label htmlFor="comment">Contenu de l&apos;article</label>
        {formErrors.content && <div className="form-error-detail">{formErrors.content}</div>}
        <textarea
          name="articleContent"
          id="articleContent"
          rows={10}
          className={formErrors.content ? "form-error" : undefined}
          ref={articleContentRef}
          defaultValue={focusedArticle?.content || undefined}
        ></textarea>
      </div>

      <div className="form-row">
        <label htmlFor="visibility">Publier l&apos;article ?</label>
        <input
          type="checkbox"
          id="visibility"
          ref={isArticleVisibleRef}
          defaultChecked={focusedArticle?.visible || false}
        />
      </div>

      <div className="form-row">
        <label htmlFor="mainImage">Image principale</label>
        <input type="file" name="mainImage" id="mainImage" ref={articleMainImageRef} />
      </div>

      <div className="form-row">
        <label htmlFor="firstAdditionalImage">Image secondaire (1)</label>
        <input
          type="file"
          name="firstAdditionalImage"
          id="firstAdditionalImage"
          ref={articleFirstAdditionalImageRef}
        />
      </div>

      <div className="form-row">
        <label htmlFor="secondAdditionalImage">Image secondaire (2)</label>
        <input
          type="file"
          name="secondAdditionalImage"
          id="secondAdditionalImage"
          ref={articleSecondAdditionalImageRef}
        />
      </div>

      <div className="form-row">
        <label htmlFor="thirdAdditionalImage">Image secondaire (3)</label>
        <input
          type="file"
          name="thirdAdditionalImage"
          id="thirdAdditionalImage"
          ref={articleThirdAdditionalImageRef}
        />
      </div>

      <input
        type="submit"
        value={`${patchMethod ? "Modifier" : "Créer"} l'article`}
        className="btn btn-primary"
      />
    </form>
  );
};

export default ArticleForm;
