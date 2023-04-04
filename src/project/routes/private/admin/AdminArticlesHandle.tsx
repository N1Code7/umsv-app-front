import { MouseEvent, useState } from "react";
import useSWR from "swr";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { sleep } from "../../../../utils/globals";
import { IArticle } from "../../../../interfaces/interfaces";
import ArticleBand from "../../../features/articles/ArticleBand";
import Modal from "../../../components/Modal";
import ArticleForm from "../../../features/articles/ArticleForm";

interface IProps {}

const AdminArticlesHandle = ({}: IProps) => {
  //
  const axiosPrivate = useAxiosPrivate();
  const [requestMessage, setRequestMessage] = useState({ success: "", error: "" });
  const [patchMethod, setPatchMethod] = useState(false);
  const [isModalActive, setIsModalActive] = useState(false);
  const [focusedArticle, setFocusedArticle] = useState({} as IArticle);

  const { data: articles, isLoading: articlesLoading } = useSWR("/articles", async (url) =>
    sleep(2000)
      .then(() => axiosPrivate.get(url))
      .then((res) => res.data)
      .catch((err) => {
        console.error(err);
      })
  );

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPatchMethod(false);
    setIsModalActive?.(true);
    setFocusedArticle({} as IArticle);
  };

  return (
    <main className="admin-space">
      {requestMessage.success !== "" && (
        <div className="notification-message">
          <p className="success">{requestMessage.success}</p>
        </div>
      )}
      {requestMessage.error !== "" && (
        <div className="notification-message">
          <p className="error">{requestMessage.error}</p>
        </div>
      )}

      <h1>Gestion des articles</h1>

      <div className="global-actions">
        <button className="btn btn-primary" onClick={handleClick}>
          Créer un article
        </button>
      </div>

      <div className="list articles-list">
        {articlesLoading ? (
          <p>Chargement des articles</p>
        ) : (
          articles
            .sort(
              (a: IArticle, b: IArticle) =>
                Number(new Date(b.updatedAt || b.createdAt)) -
                Number(new Date(a.updatedAt || a.createdAt))
            )
            .map((article: IArticle) => (
              <ArticleBand
                key={article.id}
                article={article}
                setFocusedArticle={setFocusedArticle}
                setIsModalActive={setIsModalActive}
                setPatchMethod={setPatchMethod}
                setRequestMessage={setRequestMessage}
              />
            ))
        )}
      </div>

      {isModalActive && (
        <Modal isModalActive={isModalActive} setIsModalActive={setIsModalActive}>
          <div className="modal-content modal-registration">
            <div className="title">
              <h2>Modification de l&apos;article :</h2>
            </div>

            <ArticleForm
              patchMethod={patchMethod}
              setRequestMessage={setRequestMessage}
              focusedArticle={focusedArticle}
              setIsModalActive={setIsModalActive}
            />
          </div>
        </Modal>
      )}
    </main>
  );
};

export default AdminArticlesHandle;
