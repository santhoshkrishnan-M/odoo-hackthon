"""Alembic script template."""

# Script template for generating migration files

# Note: This is a placeholder showing the structure for Alembic migrations.
# When ready to create migrations, use:
# alembic revision --autogenerate -m "Description of changes"

"""${message}

Revision ID: ${up_revision}
Revises: ${down_revision | comma,n}
Create Date: ${create_date}

"""
from alembic import op
import sqlalchemy as sa
${imports if imports else ""}

# revision identifiers, used by Alembic.
revision = ${repr(up_revision)}
down_revision = ${repr(down_revision)}
branch_labels = ${repr(branch_labels)}
depends_on = ${repr(depends_on)}


def upgrade() -> None:
    """Run upgrade migrations."""
    ${upgrades if upgrades else "pass"}


def downgrade() -> None:
    """Run downgrade migrations."""
    ${downgrades if downgrades else "pass"}
