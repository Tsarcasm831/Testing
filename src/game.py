import random
import pygame

WIDTH, HEIGHT = 800, 600
TILE = 40

class Player(pygame.sprite.Sprite):
    def __init__(self, pos):
        super().__init__()
        self.image = pygame.Surface((TILE, TILE))
        self.image.fill((50, 150, 255))
        self.rect = self.image.get_rect(center=pos)
        self.inventory = {"wood": 0, "stone": 0}
        self.tamed_dinos = pygame.sprite.Group()

    def update(self, keys):
        dx = dy = 0
        if keys[pygame.K_LEFT]:
            dx -= 5
        if keys[pygame.K_RIGHT]:
            dx += 5
        if keys[pygame.K_UP]:
            dy -= 5
        if keys[pygame.K_DOWN]:
            dy += 5
        self.rect.x += dx
        self.rect.y += dy

class Resource(pygame.sprite.Sprite):
    def __init__(self, kind, pos):
        super().__init__()
        self.kind = kind
        color = (139,69,19) if kind == "wood" else (128,128,128)
        self.image = pygame.Surface((TILE, TILE))
        self.image.fill(color)
        self.rect = self.image.get_rect(center=pos)

class Dinosaur(pygame.sprite.Sprite):
    def __init__(self, pos):
        super().__init__()
        self.image = pygame.Surface((TILE, TILE))
        self.image.fill((0,200,0))
        self.rect = self.image.get_rect(center=pos)
        self.tamed = False

    def update(self):
        if not self.tamed:
            self.rect.x += random.choice([-1,0,1]) * 2
            self.rect.y += random.choice([-1,0,1]) * 2

class Game:
    def __init__(self):
        pygame.init()
        self.screen = pygame.display.set_mode((WIDTH, HEIGHT))
        pygame.display.set_caption("Mini Ark Clone")
        self.clock = pygame.time.Clock()
        self.all_sprites = pygame.sprite.Group()
        self.resources = pygame.sprite.Group()
        self.dinos = pygame.sprite.Group()
        self.structures = pygame.sprite.Group()
        self.player = Player((WIDTH//2, HEIGHT//2))
        self.all_sprites.add(self.player)
        self.populate()

    def populate(self):
        for _ in range(15):
            kind = random.choice(["wood", "stone"])
            pos = random.randint(0, WIDTH), random.randint(0, HEIGHT)
            res = Resource(kind, pos)
            self.resources.add(res)
            self.all_sprites.add(res)
        for _ in range(5):
            pos = random.randint(0, WIDTH), random.randint(0, HEIGHT)
            d = Dinosaur(pos)
            self.dinos.add(d)
            self.all_sprites.add(d)

    def run(self):
        running = True
        while running:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_e:
                        self.interact()
                    if event.key == pygame.K_b:
                        self.build()

            keys = pygame.key.get_pressed()
            self.player.update(keys)
            self.dinos.update()

            self.screen.fill((135, 206, 235))
            self.structures.draw(self.screen)
            self.resources.draw(self.screen)
            self.dinos.draw(self.screen)
            self.all_sprites.draw(self.screen)
            self.draw_ui()
            pygame.display.flip()
            self.clock.tick(60)
        pygame.quit()

    def interact(self):
        for res in pygame.sprite.spritecollide(self.player, self.resources, dokill=True):
            self.player.inventory[res.kind] += 1
        for d in self.dinos:
            if self.player.rect.colliderect(d.rect) and not d.tamed:
                d.tamed = True
                self.player.tamed_dinos.add(d)

    def build(self):
        if self.player.inventory["wood"] >= 2 and self.player.inventory["stone"] >= 1:
            self.player.inventory["wood"] -= 2
            self.player.inventory["stone"] -= 1
            s = pygame.Surface((TILE*2, TILE*2))
            s.fill((139, 69, 19))
            rect = s.get_rect(center=self.player.rect.center)
            self.structures.add(pygame.sprite.Sprite())
            self.structures.sprites()[-1].image = s
            self.structures.sprites()[-1].rect = rect

    def draw_ui(self):
        font = pygame.font.SysFont(None, 24)
        text = f"Wood: {self.player.inventory['wood']} Stone: {self.player.inventory['stone']} Dinos: {len(self.player.tamed_dinos)}"
        surf = font.render(text, True, (0,0,0))
        self.screen.blit(surf, (10, 10))

if __name__ == '__main__':
    Game().run()
