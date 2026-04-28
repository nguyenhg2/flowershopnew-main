namespace FlowerShop.Entities
{
    public class Banner
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public string Subtitle { get; set; } = "";
        public string BackgroundCss { get; set; } = "";
        public string ButtonText { get; set; } = "";
        public string LinkUrl { get; set; } = "";
        public int SortOrder { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
